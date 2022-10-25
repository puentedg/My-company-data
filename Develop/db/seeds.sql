USE company_db;

INSERT INTO department (name) 
VALUES ('Engineering'),
       ('Finance'),
       ('Sales'),
       ('Legal');


INSERT INTO role (title, salary, department_id) 
VALUES ('Sales Lead', 120000, 1),
        ('Salesperson', 75000, 2),
        ('Lead Engineer', 13000, 3),
        ('Software Engineer', 110000, 4),
        ('Account Manager', 120000, 5),
        ('Accoutant', 90000, 6),
        ('Legal Team Lead', 15000, 7),
        ('Lawyer', 100000, 8);


INSERT INTO employee (first_name, last_name, role_id, manager_id) 
VALUES ('Andre', 'Doe', 1, null),
        ('Nigel', 'Pajot', 2, 1),
        ('Gabriella', 'Andrade', 3, null),
        ('Mike', 'Brown', 4, 3),
        ('Michele', 'Spencer', 5, null),
        ('Adam', 'Levine', 6, 5),
        ('Jacob', 'Thompson', 7, null),
        ('Jessica', 'Lee', 8, 7);

