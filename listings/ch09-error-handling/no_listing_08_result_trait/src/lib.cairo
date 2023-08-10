trait ResultTrait<T, E> {
    fn expect<impl EDrop: Drop<E>>(self: Result<T, E>, err: felt252) -> T;

    fn unwrap<impl EDrop: Drop<E>>(self: Result<T, E>) -> T;

    fn expect_err<impl TDrop: Drop<T>>(self: Result<T, E>, err: felt252) -> E;

    fn unwrap_err<impl TDrop: Drop<T>>(self: Result<T, E>) -> E;

    fn is_ok(self: @Result<T, E>) -> bool;

    fn is_err(self: @Result<T, E>) -> bool;
}
