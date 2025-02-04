import React, { useCallback, useEffect, useState } from 'react';
import debounce from 'lodash.debounce';
import { Person } from '../types/Person';

interface AutocompleteProps {
  people: Person[];
  onSelected: (person: Person | null) => void;
  text: string;
  delay?: number;
  onTextChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Autocomplete: React.FC<AutocompleteProps> = ({
  people,
  onSelected,
  delay = 300,
}) => {
  const [text, setText] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredPeople, setFilteredPeople] = useState<Person[]>(people);

  const applyQuery = useCallback(debounce(setAppliedQuery, delay), [delay]);

  useEffect(() => {
    if (!appliedQuery) {
      setFilteredPeople(people);
    } else {
      setFilteredPeople(
        people.filter(person =>
          person.name.toLowerCase().includes(appliedQuery.toLowerCase()),
        ),
      );
    }
  }, [appliedQuery, people]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
    applyQuery(event.target.value); // Використовуємо debounce для встановлення запиту
    setShowDropdown(true);
    onSelected(null);
  };

  const handleSelect = (person: Person) => {
    setText(person.name);
    setShowDropdown(false);
    onSelected(person);
  };

  return (
    <div className={`dropdown ${showDropdown ? 'is-active' : null}`}>
      <div className="dropdown-trigger">
        <input
          type="text"
          value={text}
          onChange={handleChange}
          onFocus={() => setShowDropdown(true)}
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
        />
      </div>

      {showDropdown && (
        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {filteredPeople.length > 0 ? (
              filteredPeople.map(person => (
                <div
                  key={person.slug}
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  onClick={() => {
                    handleSelect(person);
                    setShowDropdown(false);
                  }}
                >
                  <p className="has-text-link">{person.name}</p>
                </div>
              ))
            ) : (
              <div
                className="
              notification
              is-danger
              is-light
              mt-3
              is-align-self-flex-start
            "
                role="alert"
                data-cy="no-suggestions-message"
              >
                <p className="has-text-danger">No matching suggestions</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
