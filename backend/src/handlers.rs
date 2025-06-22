use actix_web::{web, HttpResponse, Responder};
use uuid::Uuid;
use crate::models::*;
use crate::db::get_pool;
use crate::soroban_client::SOROBAN_CLIENT;
use sqlx::prelude::*;
use chrono::Utc;

pub fn init_routes(cfg: &mut web::ServiceConfig) {
    cfg
        .service(web::resource("/company").route(web::post().to(create_company)))
        .service(web::resource("/companies").route(web::get().to(list_companies)))
        .service(web::resource("/user").route(web::post().to(create_user)))
        .service(web::resource("/users").route(web::get().to(list_users)))
        .service(web::resource("/loyalty/add").route(web::post().to(add_loyalty_points)))
        .service(web::resource("/transfer").route(web::post().to(transfer_points)))
        .service(web::resource("/reward/use").route(web::post().to(use_reward)))
        .service(web::resource("/report/user/{user_id}").route(web::get().to(user_report)))
        .service(web::resource("/report/company/{company_id}").route(web::get().to(company_report)));
}

async fn create_company(company: web::Json<Company>) -> impl Responder {
    let pool = get_pool();
    let c = company.into_inner();
    
    // Veritabanına kaydet
    let res = sqlx::query_as!(
        Company,
        "INSERT INTO companies (id, name, loyalty_threshold, created_at) VALUES ($1, $2, $3, $4) RETURNING *",
        Uuid::new_v4(),
        c.name,
        c.loyalty_threshold,
        Utc::now()
    )
    .fetch_one(pool)
    .await;

    match res {
        Ok(company) => {
            // Smart contract'a da kaydet
            let _ = SOROBAN_CLIENT.register_firm(company.id.as_u128(), company.loyalty_threshold as u32).await;
            HttpResponse::Ok().json(company)
        },
        Err(e) => HttpResponse::InternalServerError().body(format!("Hata: {:?}", e)),
    }
}

async fn create_user(user: web::Json<User>) -> impl Responder {
    let pool = get_pool();
    let u = user.into_inner();
    let res = sqlx::query_as!(
        User,
        "INSERT INTO users (id, name, email, wallet_address, created_at) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        Uuid::new_v4(),
        u.name,
        u.email,
        u.wallet_address,
        Utc::now()
    )
    .fetch_one(pool)
    .await;

    match res {
        Ok(user) => HttpResponse::Ok().json(user),
        Err(e) => HttpResponse::InternalServerError().body(format!("Hata: {:?}", e)),
    }
}

async fn add_loyalty_points(loyalty_tx: web::Json<LoyaltyTransaction>) -> impl Responder {
    let pool = get_pool();
    let tx = loyalty_tx.into_inner();
    
    // Veritabanına kaydet
    let res = sqlx::query_as!(
        LoyaltyTransaction,
        "INSERT INTO loyalty_transactions (id, user_id, company_id, points, created_at) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        Uuid::new_v4(),
        tx.user_id,
        tx.company_id,
        tx.points,
        Utc::now()
    )
    .fetch_one(pool)
    .await;

    match res {
        Ok(tx) => {
            // Smart contract'a da ekle
            let _ = SOROBAN_CLIENT.add_bean(tx.user_id.to_string(), tx.company_id.as_u128(), tx.points as u32).await;
            HttpResponse::Ok().json(tx)
        },
        Err(e) => HttpResponse::InternalServerError().body(format!("Hata: {:?}", e)),
    }
}

#[derive(serde::Deserialize)]
pub struct TransferRequest {
    pub from_user_id: Uuid,
    pub to_user_id: Uuid,
    pub company_id: Uuid,
    pub points: i32,
}

async fn transfer_points(req: web::Json<TransferRequest>) -> impl Responder {
    let pool = get_pool();
    let commission = (req.points as f32 * 0.03) as i32; // Sabit %3 komisyon
    let now = Utc::now();
    
    // Veritabanına kaydet
    let res = sqlx::query_as!(
        Transfer,
        "INSERT INTO transfers (id, from_user_id, to_user_id, company_id, points, commission, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
        Uuid::new_v4(),
        req.from_user_id,
        req.to_user_id,
        req.company_id,
        req.points,
        commission,
        now
    )
    .fetch_one(pool)
    .await;

    match res {
        Ok(tx) => {
            // Smart contract'a da transfer et
            let _ = SOROBAN_CLIENT.transfer_bean(
                req.from_user_id.to_string(), 
                req.to_user_id.to_string(), 
                req.company_id.as_u128(), 
                req.points as u32
            ).await;
            HttpResponse::Ok().json(tx)
        },
        Err(e) => HttpResponse::InternalServerError().body(format!("Hata: {:?}", e)),
    }
}

async fn use_reward(reward_usage: web::Json<RewardUsage>) -> impl Responder {
    let pool = get_pool();
    let usage = reward_usage.into_inner();
    
    // Veritabanına kaydet
    let res = sqlx::query_as!(
        RewardUsage,
        "INSERT INTO reward_usages (id, user_id, company_id, reward_type, used_at) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        Uuid::new_v4(),
        usage.user_id,
        usage.company_id,
        usage.reward_type,
        Utc::now()
    )
    .fetch_one(pool)
    .await;

    match res {
        Ok(usage) => {
            // Smart contract'ta da kullan
            let _ = SOROBAN_CLIENT.use_free_coffee(usage.user_id.to_string(), usage.company_id.as_u128()).await;
            HttpResponse::Ok().json(usage)
        },
        Err(e) => HttpResponse::InternalServerError().body(format!("Hata: {:?}", e)),
    }
}

async fn user_report(path: web::Path<Uuid>) -> impl Responder {
    let pool = get_pool();
    let user_id = path.into_inner();
    
    // Veritabanından al
    let txs = sqlx::query_as!(LoyaltyTransaction, "SELECT * FROM loyalty_transactions WHERE user_id = $1", user_id)
        .fetch_all(pool)
        .await;
    let rewards = sqlx::query_as!(RewardUsage, "SELECT * FROM reward_usages WHERE user_id = $1", user_id)
        .fetch_all(pool)
        .await;
    
    // Smart contract'tan da al
    let smart_contract_data = SOROBAN_CLIENT.report_user(user_id.to_string()).await;
    
    match (txs, rewards, smart_contract_data) {
        (Ok(txs), Ok(rewards), Ok(sc_data)) => {
            let response = serde_json::json!({
                "database": {
                    "transactions": txs,
                    "rewards": rewards
                },
                "smart_contract": sc_data
            });
            HttpResponse::Ok().json(response)
        },
        _ => HttpResponse::InternalServerError().body("Rapor alınamadı"),
    }
}

async fn company_report(path: web::Path<Uuid>) -> impl Responder {
    let pool = get_pool();
    let company_id = path.into_inner();
    
    // Veritabanından al
    let txs = sqlx::query_as!(LoyaltyTransaction, "SELECT * FROM loyalty_transactions WHERE company_id = $1", company_id)
        .fetch_all(pool)
        .await;
    let rewards = sqlx::query_as!(RewardUsage, "SELECT * FROM reward_usages WHERE company_id = $1", company_id)
        .fetch_all(pool)
        .await;
    
    // Smart contract'tan da al
    let smart_contract_data = SOROBAN_CLIENT.report_firm(company_id.as_u128()).await;
    
    match (txs, rewards, smart_contract_data) {
        (Ok(txs), Ok(rewards), Ok((total_beans, free_coffees))) => {
            let response = serde_json::json!({
                "database": {
                    "transactions": txs,
                    "rewards": rewards
                },
                "smart_contract": {
                    "total_beans": total_beans,
                    "available_free_coffees": free_coffees
                }
            });
            HttpResponse::Ok().json(response)
        },
        _ => HttpResponse::InternalServerError().body("Rapor alınamadı"),
    }
}

async fn list_companies() -> impl Responder {
    let pool = get_pool();
    let companies = sqlx::query_as!(Company, "SELECT * FROM companies ORDER BY created_at DESC")
        .fetch_all(pool)
        .await;

    match companies {
        Ok(companies) => HttpResponse::Ok().json(companies),
        Err(e) => HttpResponse::InternalServerError().body(format!("Hata: {:?}", e)),
    }
}

async fn list_users() -> impl Responder {
    let pool = get_pool();
    let users = sqlx::query_as!(User, "SELECT * FROM users ORDER BY created_at DESC")
        .fetch_all(pool)
        .await;

    match users {
        Ok(users) => HttpResponse::Ok().json(users),
        Err(e) => HttpResponse::InternalServerError().body(format!("Hata: {:?}", e)),
    }
} 