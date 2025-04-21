struct MySource {
    pub data: u8,
}

struct MyTarget {
    pub data: u8,
}

#[generate_trait]
impl TargetImpl of TargetTrait {
    fn foo(self: MyTarget) -> u8 {
        self.data
    }
}

impl SourceDeref of Deref<MySource> {
    type Target = MyTarget;
    fn deref(self: MySource) -> MyTarget {
        MyTarget { data: self.data }
    }
}

fn main() {
    let source = MySource { data: 5 };
    // Thanks to the Deref impl, we can call foo directly on MySource
    let res = source.foo();
    assert!(res == 5);
}
