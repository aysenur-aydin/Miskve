#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, symbol_short, Vec, Map};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Firm {
    pub id: u128,
    pub free_coffee_threshold: u32, // Kaç çekirdekte 1 kahve
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct UserLoyalty {
    pub user: Address,
    pub firm_id: u128,
    pub beans: u32, // Çekirdek sayısı
    pub free_coffee: u32, // Kazanılan bedava kahve
    pub used_free_coffee: u32, // Kullanılan bedava kahve
}

#[contract]
pub struct LoyaltyContract;

#[contractimpl]
impl LoyaltyContract {
    pub fn register_firm(env: Env, id: u128, free_coffee_threshold: u32) {
        let mut firms: Map<u128, Firm> = env.storage().persistent().get(&symbol_short!("firms")).unwrap_or(Map::new(&env));
        let firm = Firm { id, free_coffee_threshold };
        firms.set(id, firm);
        env.storage().persistent().set(&symbol_short!("firms"), &firms);
    }

    pub fn add_bean(env: Env, user: Address, firm_id: u128, count: u32) {
        let mut users: Vec<UserLoyalty> = env.storage().persistent().get(&symbol_short!("users")).unwrap_or(Vec::new(&env));
        let mut found = false;
        for i in 0..users.len() {
            let mut ul = users.get_unchecked(i);
            if ul.user == user && ul.firm_id == firm_id {
                ul.beans += count;
                // Bedava kahve kazanımı
                let firms: Map<u128, Firm> = env.storage().persistent().get(&symbol_short!("firms")).unwrap_or(Map::new(&env));
                if let Some(firm) = firms.get(firm_id) {
                    while ul.beans >= firm.free_coffee_threshold {
                        ul.beans -= firm.free_coffee_threshold;
                        ul.free_coffee += 1;
                    }
                }
                users.remove(i);
                users.insert(i, ul);
                found = true;
                break;
            }
        }
        if !found {
            let ul = UserLoyalty { user: user.clone(), firm_id, beans: count, free_coffee: 0, used_free_coffee: 0 };
            users.push_back(ul);
        }
        env.storage().persistent().set(&symbol_short!("users"), &users);
    }

    pub fn transfer_bean(env: Env, from: Address, to: Address, firm_id: u128, count: u32) {
        let mut users: Vec<UserLoyalty> = env.storage().persistent().get(&symbol_short!("users")).unwrap_or(Vec::new(&env));
        let mut from_idx = None;
        let mut to_idx = None;
        for i in 0..users.len() {
            let ul = users.get_unchecked(i);
            if ul.user == from && ul.firm_id == firm_id {
                from_idx = Some(i);
            }
            if ul.user == to && ul.firm_id == firm_id {
                to_idx = Some(i);
            }
        }
        if let Some(i) = from_idx {
            let mut from_user = users.get_unchecked(i);
            if from_user.beans >= count {
                from_user.beans -= count;
                users.remove(i);
                users.insert(i, from_user.clone());
                if let Some(j) = to_idx {
                    let mut to_user = users.get_unchecked(j);
                    to_user.beans += count;
                    users.remove(j);
                    users.insert(j, to_user);
                } else {
                    let to_user = UserLoyalty { user: to.clone(), firm_id, beans: count, free_coffee: 0, used_free_coffee: 0 };
                    users.push_back(to_user);
                }
                env.storage().persistent().set(&symbol_short!("users"), &users);
            }
        }
    }

    pub fn use_free_coffee(env: Env, user: Address, firm_id: u128) {
        let mut users: Vec<UserLoyalty> = env.storage().persistent().get(&symbol_short!("users")).unwrap_or(Vec::new(&env));
        for i in 0..users.len() {
            let mut ul = users.get_unchecked(i);
            if ul.user == user && ul.firm_id == firm_id && ul.free_coffee > ul.used_free_coffee {
                ul.used_free_coffee += 1;
                users.remove(i);
                users.insert(i, ul);
                break;
            }
        }
        env.storage().persistent().set(&symbol_short!("users"), &users);
    }

    pub fn report_firm(env: Env, firm_id: u128) -> (u32, u32) {
        // Firma için toplam çekirdek ve toplam bedava kahve
        let users: Vec<UserLoyalty> = env.storage().persistent().get(&symbol_short!("users")).unwrap_or(Vec::new(&env));
        let mut total_beans = 0;
        let mut total_free_coffee = 0;
        for i in 0..users.len() {
            let ul = users.get_unchecked(i);
            if ul.firm_id == firm_id {
                total_beans += ul.beans;
                total_free_coffee += ul.free_coffee - ul.used_free_coffee;
            }
        }
        (total_beans, total_free_coffee)
    }

    pub fn report_user(env: Env, user: Address) -> Vec<UserLoyalty> {
        // Kullanıcıya ait tüm sadakat kayıtları
        let users: Vec<UserLoyalty> = env.storage().persistent().get(&symbol_short!("users")).unwrap_or(Vec::new(&env));
        let mut result = Vec::new(&env);
        for i in 0..users.len() {
            let ul = users.get_unchecked(i);
            if ul.user == user {
                result.push_back(ul);
            }
        }
        result
    }

    pub fn transfer_free_coffee(env: Env, from: Address, to: Address, firm_id: u128, count: u32) {
        let mut users: Vec<UserLoyalty> = env.storage().persistent().get(&symbol_short!("users")).unwrap_or(Vec::new(&env));
        let mut from_idx = None;
        let mut to_idx = None;
        for i in 0..users.len() {
            let ul = users.get_unchecked(i);
            if ul.user == from && ul.firm_id == firm_id {
                from_idx = Some(i);
            }
            if ul.user == to && ul.firm_id == firm_id {
                to_idx = Some(i);
            }
        }
        if let Some(i) = from_idx {
            let mut from_user = users.get_unchecked(i);
            if from_user.free_coffee - from_user.used_free_coffee >= count {
                from_user.free_coffee -= count;
                users.remove(i);
                users.insert(i, from_user.clone());
                if let Some(j) = to_idx {
                    let mut to_user = users.get_unchecked(j);
                    to_user.free_coffee += count;
                    users.remove(j);
                    users.insert(j, to_user);
                } else {
                    let to_user = UserLoyalty { user: to.clone(), firm_id, beans: 0, free_coffee: count, used_free_coffee: 0 };
                    users.push_back(to_user);
                }
                env.storage().persistent().set(&symbol_short!("users"), &users);
            }
        }
    }

    pub fn transfer_bean_with_fee(env: Env, from: Address, to: Address, firm_id: u128, count: u32, fee_percent: u32, system: Address) {
        let mut users: Vec<UserLoyalty> = env.storage().persistent().get(&symbol_short!("users")).unwrap_or(Vec::new(&env));
        let mut from_idx = None;
        let mut to_idx = None;
        let mut system_idx = None;
        for i in 0..users.len() {
            let ul = users.get_unchecked(i);
            if ul.user == from && ul.firm_id == firm_id {
                from_idx = Some(i);
            }
            if ul.user == to && ul.firm_id == firm_id {
                to_idx = Some(i);
            }
            if ul.user == system && ul.firm_id == firm_id {
                system_idx = Some(i);
            }
        }
        if let Some(i) = from_idx {
            let mut from_user = users.get_unchecked(i);
            if from_user.beans >= count {
                let fee = (count * fee_percent) / 100;
                let net = count - fee;
                from_user.beans -= count;
                users.remove(i);
                users.insert(i, from_user.clone());
                // Alıcıya aktar
                if let Some(j) = to_idx {
                    let mut to_user = users.get_unchecked(j);
                    to_user.beans += net;
                    users.remove(j);
                    users.insert(j, to_user);
                } else {
                    let to_user = UserLoyalty { user: to.clone(), firm_id, beans: net, free_coffee: 0, used_free_coffee: 0 };
                    users.push_back(to_user);
                }
                // Komisyonu sistem hesabına aktar
                if let Some(k) = system_idx {
                    let mut sys_user = users.get_unchecked(k);
                    sys_user.beans += fee;
                    users.remove(k);
                    users.insert(k, sys_user);
                } else {
                    let sys_user = UserLoyalty { user: system.clone(), firm_id, beans: fee, free_coffee: 0, used_free_coffee: 0 };
                    users.push_back(sys_user);
                }
                env.storage().persistent().set(&symbol_short!("users"), &users);
            }
        }
    }
}

pub fn add(left: u64, right: u64) -> u64 {
    left + right
}

#[cfg(test)]
mod tests {
    use super::*;
    use soroban_sdk::{testutils::Address as _, Env};

    #[test]
    fn test_register_and_report() {
        let env = Env::default();
        let firm_id = 1u128;
        LoyaltyContract::register_firm(env.clone(), firm_id, 10);
        let user = Address::random(&env);
        LoyaltyContract::add_bean(env.clone(), user.clone(), firm_id, 25);
        let (beans, free_coffee) = LoyaltyContract::report_firm(env.clone(), firm_id);
        assert_eq!(beans, 5); // 25 - 2*10 = 5
        assert_eq!(free_coffee, 2);
        let user_loyalty = LoyaltyContract::report_user(env.clone(), user.clone());
        assert_eq!(user_loyalty.len(), 1);
        assert_eq!(user_loyalty.get_unchecked(0).beans, 5);
        assert_eq!(user_loyalty.get_unchecked(0).free_coffee, 2);
    }

    #[test]
    fn test_transfer_free_coffee() {
        let env = Env::default();
        let firm_id = 1u128;
        LoyaltyContract::register_firm(env.clone(), firm_id, 10);
        let user1 = Address::random(&env);
        let user2 = Address::random(&env);
        LoyaltyContract::add_bean(env.clone(), user1.clone(), firm_id, 20);
        LoyaltyContract::transfer_free_coffee(env.clone(), user1.clone(), user2.clone(), firm_id, 1);
        let u1 = LoyaltyContract::report_user(env.clone(), user1.clone());
        let u2 = LoyaltyContract::report_user(env.clone(), user2.clone());
        assert_eq!(u1.get_unchecked(0).free_coffee, 1);
        assert_eq!(u2.get_unchecked(0).free_coffee, 1);
    }

    #[test]
    fn test_transfer_bean_with_fee() {
        let env = Env::default();
        let firm_id = 1u128;
        LoyaltyContract::register_firm(env.clone(), firm_id, 10);
        let user1 = Address::random(&env);
        let user2 = Address::random(&env);
        let system = Address::random(&env);
        LoyaltyContract::add_bean(env.clone(), user1.clone(), firm_id, 100);
        LoyaltyContract::transfer_bean_with_fee(env.clone(), user1.clone(), user2.clone(), firm_id, 50, 3, system.clone());
        let u1 = LoyaltyContract::report_user(env.clone(), user1.clone());
        let u2 = LoyaltyContract::report_user(env.clone(), user2.clone());
        let sys = LoyaltyContract::report_user(env.clone(), system.clone());
        assert_eq!(u1.get_unchecked(0).beans, 50);
        assert_eq!(u2.get_unchecked(0).beans, 48); // 50 - 3% = 48
        assert_eq!(sys.get_unchecked(0).beans, 1); // 3% of 50 = 1 (yuvarlama)
    }
} 