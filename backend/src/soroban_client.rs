use serde::{Deserialize, Serialize};

// Smart contract fonksiyonları için wrapper
pub struct SorobanLoyaltyClient {
    contract_id: String,
    network_url: String,
}

impl SorobanLoyaltyClient {
    pub fn new(contract_id: String, network_url: String) -> Self {
        Self {
            contract_id,
            network_url,
        }
    }

    // Firma kaydetme
    pub async fn register_firm(&self, firm_id: u128, free_coffee_threshold: u32) -> Result<(), String> {
        // Bu fonksiyon smart contract'ı çağıracak
        // Şimdilik mock implementasyon
        println!("Smart contract: register_firm({}, {})", firm_id, free_coffee_threshold);
        Ok(())
    }

    // Puan ekleme
    pub async fn add_bean(&self, user_address: String, firm_id: u128, count: u32) -> Result<(), String> {
        println!("Smart contract: add_bean({}, {}, {})", user_address, firm_id, count);
        Ok(())
    }

    // Puan transferi
    pub async fn transfer_bean(&self, from: String, to: String, firm_id: u128, count: u32) -> Result<(), String> {
        println!("Smart contract: transfer_bean({}, {}, {}, {})", from, to, firm_id, count);
        Ok(())
    }

    // Bedava kahve kullanma
    pub async fn use_free_coffee(&self, user_address: String, firm_id: u128) -> Result<(), String> {
        println!("Smart contract: use_free_coffee({}, {})", user_address, firm_id);
        Ok(())
    }

    // Firma raporu
    pub async fn report_firm(&self, firm_id: u128) -> Result<(u32, u32), String> {
        println!("Smart contract: report_firm({})", firm_id);
        // Mock veri döndür
        Ok((1000, 5)) // (toplam çekirdek, kullanılabilir bedava kahve)
    }

    // Kullanıcı raporu
    pub async fn report_user(&self, user_address: String) -> Result<Vec<UserLoyaltyData>, String> {
        println!("Smart contract: report_user({})", user_address);
        // Mock veri döndür
        let mut result = Vec::new();
        result.push(UserLoyaltyData {
            user: user_address,
            firm_id: 1,
            beans: 150,
            free_coffee: 2,
            used_free_coffee: 1,
        });
        Ok(result)
    }
}

// Smart contract'tan dönen veri yapısı
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UserLoyaltyData {
    pub user: String,
    pub firm_id: u128,
    pub beans: u32,
    pub free_coffee: u32,
    pub used_free_coffee: u32,
}

// Global client instance
lazy_static::lazy_static! {
    pub static ref SOROBAN_CLIENT: SorobanLoyaltyClient = {
        // Contract ID'yi environment variable'dan al veya default kullan
        let contract_id = std::env::var("SOROBAN_CONTRACT_ID")
            .unwrap_or_else(|_| "CCR6QKTWZQYW6YUJ7UP7XXZRLWQPFRV6SWBLQS4ZQOSAF4BOUD77OTE2".to_string());
        
        let network_url = std::env::var("SOROBAN_NETWORK_URL")
            .unwrap_or_else(|_| "https://soroban-testnet.stellar.org".to_string());
        
        SorobanLoyaltyClient::new(contract_id, network_url)
    };
} 