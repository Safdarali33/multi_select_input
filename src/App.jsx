import { useEffect, useRef, useState } from 'react'
import './App.css'
import Pill from './Pill'

function App() {
  const [searchValue, setSearchValue] = useState("")
  const [suggestions, setSuggestions] = useState([])
  const [selectedUsers, setSelectedUsers] = useState([])
  const [selectedUserSet, setSelectedUserSet] = useState(new Set())
  const inputRef = useRef()

  useEffect(() => {
    let timeoutId;

    // Function to fetch users
    const fetchUsers = () => {
      if (searchValue.trim() === "") {
        setSuggestions([]);
        return;
      }

      fetch(`https://dummyjson.com/users/search?q=${searchValue}`)
        .then(res => res.json())
        .then((data) => setSuggestions(data))
        .catch((err) => {
          console.log(err);
        });
    };

    const debouncedFetchUsers = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        fetchUsers();
      }, 1000);
    };

    debouncedFetchUsers();

    return () => {
      // required if the component unmounts or searchvalue cahnges
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [searchValue]);

  const handleSelectUser = (user) => {
    setSelectedUsers([...selectedUsers, user])
    setSelectedUserSet(new Set([...selectedUserSet, user.email]))
    setSearchValue("")
    setSuggestions([])
  }

  const handleRemoveUser = (user) => {
    const updatedUsers = selectedUsers.filter((selectedUser) => 
      selectedUser.id !== user.id
    )
    setSelectedUsers(updatedUsers)
    const updatedEmails = new Set(selectedUserSet)
    updatedEmails.delete(user.email);
    setSelectedUserSet(updatedEmails)
  }

  return (
    <>
      <div className='user-search-container'>
        <div className="user-search-input">
        {selectedUsers.map((user) => {
          return (
            <Pill
              key={user.email}
              image={user.image}
              text={`${user.firstName} ${user.lastName}`}
              onClick={() => handleRemoveUser(user)}
            />
          );
        })}
          <div>
            <input 
              type="text" 
              value={searchValue} 
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder='Search for a User...'
            />
            <ul className="suggestions-list">
              {suggestions?.users?.map((user,index) => {
                return !selectedUserSet.has(user.email) ? (
                  <li key={user.email} onClick={() => handleSelectUser(user)}>
                    <img 
                      src={user.image}  
                      alt={`${user.firstName} ${user.lastName}`} 
                    />
                    <span>{user.firstName} {user.lastName}</span>
                  </li>
                ) : (
                  <></>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
