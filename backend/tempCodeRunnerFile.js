await db.query("Create table employee(id int, name varchar(20))")
console.log(await db.query("select * from employee"))