#[derive(Drop)]
struct ProducerType {}

#[derive(Drop)]
struct AnotherType {}

#[derive(Drop)]
struct AThirdType {}

trait Producer<T> {
    fn produce(self: T) -> u32;
}

trait Consumer<T> {
    fn consume(self: T, input: u32);
}

impl ProducerImpl of Producer<ProducerType> {
    fn produce(self: ProducerType) -> u32 {
        42
    }
}

impl TConsumerImpl<T, +Drop<T>, -Producer<T>> of Consumer<T> {
    fn consume(self: T, input: u32) {
        println!("Consumed value: {}", input);
    }
}

fn main() {
    let producer = ProducerType {};
    let another_type = AnotherType {};
    let third_type = AThirdType {};
    let production = producer.produce();

    // producer.consumer(production); Invalid: ProducerType does not implement Consumer
    another_type.consume(production);
    third_type.consume(production);
}
