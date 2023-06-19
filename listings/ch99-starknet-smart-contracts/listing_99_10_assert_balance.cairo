#[external]
fn withdraw(amount: u256) {
    let current_balance = balance::read();

    assert(balance >= amount, "Insufficient funds");

    balance::write(current_balance - amount);
}