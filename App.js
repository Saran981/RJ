import { useEffect, useState } from 'react';
import {Button, EditableText,InputGroup,Toaster} from '@blueprintjs/core'; 
import './App.css';

const AppToaster= Toaster.create({
    position: "top",
});

function App() {
    const [users,setUsers] = useState([]);
    const [newName,setNewName]= useState(""); //getting new data and users
    const [newEmail,setNewEmail]= useState("");
    const [newWebsite,setNewWebsite]= useState("");

    useEffect(() => {
        fetch('https://jsonplaceholder.typicode.com/users') //get request
        .then((response) =>response.json() )
        .then((json) => setUsers(json)); //converting and setting the get request
    }, []);
    
    function addUser(){
        const name= newName.trim();
        const email= newEmail.trim();
        const website= newWebsite.trim();

        if(name && email && website){
            fetch('https://jsonplaceholder.typicode.com/users',{ //post
                    method:"POST",
                    body: JSON.stringify({  name,email,website}), //json data sending
                    headers: {
                        "Content-Type": "application/json; charset=UTF-8" //json data
                    }
                })
                .then((response) => response.json())
                .then(data => {
                setUsers([...users,data]); //...spread operator
                AppToaster.show({
                    message: "user added successfully",
                    intent: "success",
                    timeout: 3000
                });
                setNewName("");
                setNewEmail("");
                setNewWebsite("");
            });
        }
    }

    function onChangeHandler(id,key,value){
        setUsers((users) => {
            return users.map(user => {
                return user.id === id ? {...user, [key]:value } :user
            })
        })
    }

    function updateUser(id){
        const user= users.find((user) => user.id === id);
        
            fetch('https://jsonplaceholder.typicode.com/users/${id}',{
                    method:"PUT",
                    body: JSON.stringify(user),
                    headers: {
                        "Content-Type": "application/json; charset=UTF-8" 
                    }
                })
                .then((response) => response.json())
                .then(data => {
                AppToaster.show({
                    message: "user updated successfully",
                    intent: "success",
                    timeout: 3000
                });
            });
        }

    function deleteUser(id){
        fetch('https://jsonplaceholder.typicode.com/users/${id}',{
            method:"DELETE",
        })
        .then((response) => response.json())
        .then(data => {
            setUsers((users) =>{
                return users.filter(user => user.id!== id)
            })
            AppToaster.show({
                message: "user deleted successfully",
                intent: "success",
                timeout: 3000
            });
        });
    }
    
    return (
        <div className="App">
            <table class='bp4-html-table modifier'>
            <thead>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Website</th>
            <th>Action</th>
            </thead>
            <tbody>
                {users.map(user =>(
                    <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.name}</td>
                        <td><EditableText onChange={value => onChangeHandler(user.id, 'emai', value)} value={user.mail}/></td>
                        <td><EditableText onChange={value => onChangeHandler(user.id, 'website', value)}value={user.website}/></td>
                        <td>
                        <Button intent='primary' onClick={()=> updateUser(user.id)}>Update</Button>
                        &nbsp;
                        <Button intent='danger' onClick={()=> deleteUser(user.id)} >Delete</Button>
                        </td>
                    </tr>
                ))}
            </tbody>
            <tfoot>
                <tr>
                    <td></td>
                    <td>
                        <InputGroup
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder='Enter Name...'
                    />
                    </td>
                    <td>
                        <InputGroup
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        placeholder='Enter Email...'
                    />
                    </td>
                    <td>
                    <InputGroup
                    value={newWebsite}
                    onChange={(e) => setNewWebsite(e.target.value)}
                    placeholder='Enter Website...'
                    />
                    </td>
                    <td>
                        <Button intent='success' onClick={addUser}>Add User</Button>
                    </td>
                </tr>
            </tfoot>
        </table>
    </div>
);
}


export default App;
