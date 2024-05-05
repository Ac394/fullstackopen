import personService from "./services/persons";
import { useState, useEffect } from "react";
import Filter from "./components/Filter";
import Header from "./components/Header";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import Notification from "./components/Notification";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNumber] = useState("");
  const [filter, setFilter] = useState("");
  const [message, setMessage] = useState(null);
  const [messageClass, setMessageClass] = useState("");

  useEffect(() => {
    personService.getAll().then((initialPersons) => setPersons(initialPersons));
  }, []);

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNumber(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const findPerson = (arr, name) => {
    const person = arr.filter((person) => person.name === name);
    return person.length ? person[0] : false;
  };

  const addPerson = (event) => {
    event.preventDefault();

    const existingPerson = findPerson(persons, newName);
    const person = { name: newName, number: newNumber };

    // if name exists in phonebook ask for phone number confirmation
    if (existingPerson) {
      if (
        confirm(
          `${existingPerson.name} is already added to the phonebook, replace the old number with a new one?`
        )
      ) {
        const updatedPerson = { ...existingPerson, number: newNumber };

        personService
          .update(updatedPerson.id, updatedPerson)
          .then((returnedPerson) => {
            const newPersons = persons.map((person) =>
              person.id === returnedPerson.id ? returnedPerson : person
            );
            setPersons(newPersons);
            setNewName("");
            setNumber("");
          })
          .catch((error) => {
            setMessageClass("error");
            setMessage(error.response.data.error);
            setTimeout(() => {
              setMessage(null);
            }, 3000);
          });
      }
      return;
    }

    // Else if the name is new, create new person
    personService
      .create(person)
      .then((returnedPerson) => {
        setMessageClass("success");
        setMessage(`Added ${returnedPerson.name}`);
        setTimeout(() => {
          setMessage(null);
        }, 3000);
        setPersons(persons.concat(returnedPerson));
        setNewName("");
        setNumber("");
      })
      .catch((error) => {
        setMessageClass("error");
        setMessage(error.response.data.error);
        setTimeout(() => {
          setMessage(null);
        }, 3000);
      });
  };

  const deletePerson = (id) => {
    const person = persons.filter((person) => person.id === id);

    if (confirm(`Delete ${person[0].name}?`)) {
      personService.remove(id).catch((error) => {
        setMessageClass("error");
        setMessage(
          `Information of ${person[0].name} has already been removed from server`
        );
        setTimeout(() => {
          setMessage(null);
        }, 3000);
      });
      const newPersons = persons.filter((person) => person.id !== id);
      setPersons(newPersons);
    }
  };

  const personsToShow =
    filter === ""
      ? persons
      : persons.filter(
          (person) => person.name.toLowerCase() === filter.toLowerCase()
        );

  return (
    <div>
      <Header text={"Phonebook"} />
      <Notification message={message} messageClass={messageClass} />
      <Filter value={filter} onChange={handleFilterChange} />
      <Header text={"Add a new"} />
      <PersonForm
        onSubmit={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />
      <Header text={"Numbers"} />
      <Persons persons={personsToShow} deletePerson={deletePerson} />
    </div>
  );
};

export default App;
