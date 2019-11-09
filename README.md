# Adaptr

Adaptr is a small helper that allows for a smoother communication between client and backend.

### Usage

```js
import Adaptr from 'adaptr';

// user object received from server
const user = {
    'id': 133,
    'is_logged_in': true
};

// we define an adapter with the desired schema
// on the left it's the expected server format
// on the right it's the desired local format
const userAdapter = new Adaptr('user', {
    'id': 'userId',
    'is_logged_in': 'isLoggedIn'
});

const localFormat = userAdapter.unserialize(user);
const serverFormat = userAdapter.serialize(localFormat);
```
**Output**
```json
localFormat: {
    user: {
       userId: 133,
       isLoggedIn: true
    }
}

serverFormat: {
    user: {
       id: 133,
       is_logged_in: true
    }
}
```


### Installation

Adaptr is dependencie free.
```sh
$ npm install adaptr
```

License
----

MIT


**Free Software, Hell Yeah!**

