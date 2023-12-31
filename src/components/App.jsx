import { Component } from 'react';

import { nanoid } from 'nanoid';

import Section from './Section';
import ContactForm from './ContactForm';
import ContactList from './ContactList';
import FilterForm from './FilterForm';

const LS_KEY = 'phonebook';

export default class App extends Component {
  state = {
    contacts: [
      { id: 'id-1', name: 'Rosie Simpson', number: '459-12-56' },
      { id: 'id-2', name: 'Hermione Kline', number: '443-89-12' },
      { id: 'id-3', name: 'Eden Clements', number: '645-17-79' },
      { id: 'id-4', name: 'Annie Copeland', number: '227-91-26' },
    ],
    filter: '',
  };

  componentDidMount() {
    const contacts = localStorage.getItem(LS_KEY);

    if (!contacts) {
      return;
    }

    try {
      this.setState({ contacts: JSON.parse(contacts) });
    } catch (error) {
      console.error('Set state error: ', error.message);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.contacts !== this.state.contacts) {
      localStorage.setItem(LS_KEY, JSON.stringify(this.state.contacts));
    }

    if (this.state.contacts.length === 0) {
      localStorage.removeItem(LS_KEY);
    }
  }

  createPerson = person => {
    const newContact = {
      id: nanoid(),
      name: person.name,
      number: person.number,
    };

    if (
      this.state.contacts.some(
        person => person.name.toLowerCase() === newContact.name.toLowerCase()
      )
    ) {
      alert(`${newContact.name} is already in contacts.`);
    } else {
      this.setState({
        contacts: [...this.state.contacts, { ...newContact }],
      });
    }
  };

  deletePerson = delPersonId => {
    this.setState(({ contacts }) => ({
      contacts: contacts.filter(({ id }) => id !== delPersonId),
    }));
  };

  setFilter = e => {
    this.setState({ filter: e.target.value });
  };

  getFilteredPersons = () => {
    const filter = this.state.filter.toLowerCase();
    const allPersons = this.state.contacts;

    if (!allPersons) return;

    const filteredPersons = allPersons.filter(person =>
      person.name.toLowerCase().includes(filter)
    );
    return filteredPersons;
  };

  render() {
    const filteredPersons = this.getFilteredPersons();

    return (
      <div>
        <h1>Phonebook</h1>
        <Section>
          <ContactForm createPerson={this.createPerson}></ContactForm>
        </Section>
        <Section title="Contacts">
          <FilterForm setFilter={this.setFilter}></FilterForm>
          <ContactList
            contacts={filteredPersons}
            deletePerson={this.deletePerson}
          ></ContactList>
        </Section>
      </div>
    );
  }
}
