use core::traits::TryInto;

#[derive(Drop, Debug, PartialEq)]
struct EvenNumber {
    value: u32
}

impl TryU32IntoEvenNumber of TryInto<u32, EvenNumber> {
    fn try_into(self: u32) -> Option<EvenNumber> {
        if self % 2 == 0 {
            Option::Some(EvenNumber { value: self })
        } else {
            Option::None
        }
    }
}

fn main() {
    let result: Option<EvenNumber> = 8_u32.try_into();
    let expected: Option<EvenNumber> = Option::Some(EvenNumber { value: 8 });
    assert_eq!(result, expected);

    let result: Option<EvenNumber> = 5_u32.try_into();
    let expected: Option<EvenNumber> = Option::None;
    assert_eq!(result, expected);
}
