use actix_web::{web, App, HttpServer};
use actix_cors::Cors;
mod models;
mod handlers;
mod db;
mod soroban_client;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    db::init_db().await.expect("DB bağlantısı başarısız!");

    HttpServer::new(|| {
        let cors = Cors::default()
            .allow_any_origin()
            .allow_any_method()
            .allow_any_header()
            .max_age(3600);

        App::new()
            .wrap(cors)
            .configure(handlers::init_routes)
    })
    .bind(("localhost", 8080))?
    .run()
    .await
} 