
## Run the project

1. create docker-compose.override.yml file in the root folder of the project. Paste code below

```yml
services:
  db:
    environment:
      - POSTGRES_NAME=
      - POSTGRES_USER=
      - POSTGRES_PASSWORD=
  web:
    environment:
      - POSTGRES_NAME=
      - POSTGRES_USER=
      - POSTGRES_PASSWORD=
      - SECRET_KEY=


```

Environment variables with the same name should have the same value.

2. In the **backend/api** folder add **signals.py** and create function:
```python
def send_payment_confirmation(order):
  #Your code to handle sending emails
```

3. In folder **ecommerce/api/** create file **sendmail.py** and create function responsible for sending emails for password reset:
```python
@receiver(post_save, sender=PasswordResetToken)
def send_email_with_token(sender, instance, created=True, **kwargs):
```

4. Configure **settings.py** file in **backend/calorienotesapi** folder. 

6. In root folder
```bash
docker-compose up
```

## Test the project
1. To test frontend app, in **ecommerce/frontend** folder:
```bash
npm run test
```
