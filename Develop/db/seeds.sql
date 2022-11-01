USE company_db;

INSERT INTO department (name) VALUES ('Engineering'),
                                        ('Finance'),
                                        ('Sales'),
                                        ('Legal');


INSERT INTO role (title, salary, department_id) VALUES ('Sales Lead', 120000, 3),
                                                        ('Salesperson', 75000, 3),
                                                        ('Lead Engineer', 13000, 1),
                                                        ('Software Engineer', 110000, 1),
                                                        ('Account Manager', 120000, 2),
                                                        ('Accoutant', 90000, 2),
                                                        ('Legal Team Lead', 15000, 4),
                                                        ('Lawyer', 100000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Andre', 'Doe', 1, null), 
                                                                        ('Nigel', 'Pajot', 2, null),
                                                                        ('Gabriella', 'Andrade', 3, null),
                                                                        ('Mike', 'Brown', 4, null);


INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Michele', 'Spencer', 5, 1),
                                                                        ('Adam', 'Levine', 6, 2),
                                                                        ('Jacob', 'Thompson', 7, 3),
                                                                        ('Jessica', 'Lee', 8, 4);

