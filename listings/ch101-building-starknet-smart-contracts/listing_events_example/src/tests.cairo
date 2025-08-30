use snforge_std::{
    ContractClassTrait, DeclareResultTrait, EventSpyAssertionsTrait, declare, spy_events,
};
use starknet::ContractAddress;
use super::EventExample::{
    BookAdded, BookRemoved, Event, FieldUpdated, UpdatedAuthorData, UpdatedTitleData,
};
use super::{IEventExampleDispatcher, IEventExampleDispatcherTrait};

fn deploy_contract() -> (IEventExampleDispatcher, ContractAddress) {
    let contract = declare("EventExample").unwrap().contract_class();
    let (contract_address, _) = contract.deploy(@array![]).unwrap();
    (IEventExampleDispatcher { contract_address }, contract_address)
}

#[test]
fn test_add_book_emits_event() {
    let (dispatcher, contract_address) = deploy_contract();
    let mut spy = spy_events();

    let book_id = 1_u32;
    let title = 'The Cairo Book';
    let author = 'StarkWare';

    dispatcher.add_book(book_id, title, author);

    let expected_event = Event::BookAdded(BookAdded { id: book_id, title, author });
    spy.assert_emitted(@array![(contract_address, expected_event)]);
}

#[test]
fn test_change_book_title_emits_event() {
    let (dispatcher, contract_address) = deploy_contract();
    let mut spy = spy_events();

    let book_id = 1_u32;
    let new_title = 'Cairo Programming';

    dispatcher.change_book_title(book_id, new_title);

    let expected_event = Event::FieldUpdated(
        FieldUpdated::Title(UpdatedTitleData { id: book_id, new_title }),
    );
    spy.assert_emitted(@array![(contract_address, expected_event)]);
}

#[test]
fn test_change_book_author_emits_event() {
    let (dispatcher, contract_address) = deploy_contract();
    let mut spy = spy_events();

    let book_id = 2_u32;
    let new_author = 'Cairo Team';

    dispatcher.change_book_author(book_id, new_author);

    let expected_event = Event::FieldUpdated(
        FieldUpdated::Author(UpdatedAuthorData { id: book_id, new_author }),
    );
    spy.assert_emitted(@array![(contract_address, expected_event)]);
}

#[test]
fn test_remove_book_emits_event() {
    let (dispatcher, contract_address) = deploy_contract();
    let mut spy = spy_events();

    let book_id = 3_u32;

    dispatcher.remove_book(book_id);

    let expected_event = Event::BookRemoved(BookRemoved { id: book_id });
    spy.assert_emitted(@array![(contract_address, expected_event)]);
}

#[test]
fn test_multiple_operations_emit_events() {
    let (dispatcher, contract_address) = deploy_contract();
    let mut spy = spy_events();

    dispatcher.add_book(1, 'Book One', 'Author One');
    dispatcher.change_book_title(1, 'Updated Book One');
    dispatcher.change_book_author(1, 'Updated Author');
    dispatcher.add_book(2, 'Book Two', 'Author Two');
    dispatcher.remove_book(1);

    let expected_events = array![
        (
            contract_address,
            Event::BookAdded(BookAdded { id: 1, title: 'Book One', author: 'Author One' }),
        ),
        (
            contract_address,
            Event::FieldUpdated(
                FieldUpdated::Title(UpdatedTitleData { id: 1, new_title: 'Updated Book One' }),
            ),
        ),
        (
            contract_address,
            Event::FieldUpdated(
                FieldUpdated::Author(UpdatedAuthorData { id: 1, new_author: 'Updated Author' }),
            ),
        ),
        (
            contract_address,
            Event::BookAdded(BookAdded { id: 2, title: 'Book Two', author: 'Author Two' }),
        ),
        (contract_address, Event::BookRemoved(BookRemoved { id: 1 })),
    ];

    spy.assert_emitted(@expected_events);
}
