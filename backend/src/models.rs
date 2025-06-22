use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use uuid::Uuid;
use chrono::{DateTime, Utc};

#[derive(Serialize, Deserialize, FromRow, Debug, Clone)]
pub struct Company {
    pub id: Uuid,
    pub name: String,
    pub loyalty_threshold: i32,
    pub created_at: DateTime<Utc>,
}

#[derive(Serialize, Deserialize, FromRow, Debug, Clone)]
pub struct User {
    pub id: Uuid,
    pub name: String,
    pub email: String,
    pub wallet_address: String,
    pub created_at: DateTime<Utc>,
}

#[derive(Serialize, Deserialize, FromRow, Debug, Clone)]
pub struct LoyaltyTransaction {
    pub id: Uuid,
    pub user_id: Uuid,
    pub company_id: Uuid,
    pub points: i32,
    pub created_at: DateTime<Utc>,
}

#[derive(Serialize, Deserialize, FromRow, Debug, Clone)]
pub struct RewardUsage {
    pub id: Uuid,
    pub user_id: Uuid,
    pub company_id: Uuid,
    pub reward_type: String,
    pub used_at: DateTime<Utc>,
}

#[derive(Serialize, Deserialize, FromRow, Debug, Clone)]
pub struct Transfer {
    pub id: Uuid,
    pub from_user_id: Uuid,
    pub to_user_id: Uuid,
    pub company_id: Uuid,
    pub points: i32,
    pub commission: i32,
    pub created_at: DateTime<Utc>,
}

// Structs for request bodies
#[derive(Deserialize, Debug)]
pub struct CreateCompany {
    pub name: String,
}

#[derive(Deserialize, Debug)]
pub struct CreateUser {
    pub name: String,
    pub email: String,
    pub wallet_address: String,
}

#[derive(Deserialize, Debug)]
pub struct AddLoyalty {
    pub user_id: Uuid,
    pub company_id: Uuid,
    pub beans_added: i32,
}

#[derive(Deserialize, Debug)]
pub struct UseReward {
    pub user_id: Uuid,
    pub company_id: Uuid,
    pub reward_type: String,
}

#[derive(Deserialize, Debug)]
pub struct CreateTransfer {
    pub from_user_id: Uuid,
    pub to_user_id: Uuid,
    pub company_id: Uuid,
    pub beans_transferred: i32,
} 