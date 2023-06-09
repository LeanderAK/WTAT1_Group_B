# WTAT1_Group_B

## Admin Route

Visit `/admin/users` to get an overview of all existing users including links to their profiles and their created posts.
This is useful for testing the DB relations and quickly navigating to CRUD commands of specific documents.

## Database Commands

Start mongodb server in a new terminal with
``` 
mongod 
```


Start Mongodb on Mac: 

```
sudo mongod --dbpath /System/Volumes/Data/data/db
```
```
mongod --path /Users/leander/Desktop/Agile-Web/db
```

Run dummyData file by entering 
```
npm run resetdb
```
or

```
node dummyData.js
```
in terminal in each subsequent lesson to avoid having an empty or inconsistent database.

## Resources

[Icon-Set](https://www.streamlinehq.com/icons/streamline-mini-line)
