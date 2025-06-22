use sqlx::{PgPool, postgres::PgPoolOptions};
use std::env;
use once_cell::sync::OnceCell;

static DB_POOL: OnceCell<PgPool> = OnceCell::new();

pub async fn init_db() -> Result<(), sqlx::Error> {
    dotenv::dotenv().ok();
    let db_url = env::var("DATABASE_URL").expect("DATABASE_URL .env'de yok!");
    let pool = PgPoolOptions::new()
        .max_connections(5)
        .connect(&db_url)
        .await?;
    DB_POOL.set(pool).unwrap();
    Ok(())
}

pub fn get_pool() -> &'static PgPool {
    DB_POOL.get().expect("DB pool init edilmedi!")
} 