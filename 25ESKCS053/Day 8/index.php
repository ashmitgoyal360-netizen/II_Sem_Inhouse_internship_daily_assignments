<!DOCTYPE html>
<html lang="en">

<head>

    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Student Registration Form</title>

    <link rel="stylesheet" href="style.css">

</head>

<body>

    <div class="container">

        <h1>Student Registration Form</h1>

        <form action="process.php" method="post">

            <label>Name</label>
            <input type="text" name="name" required>

            <label>Email</label>
            <input type="email" name="email" required>

            <label>Password</label>
            <input type="password" name="password" required>

            <label>Phone Number</label>
            <input type="tel" name="phone" required>

            <label>Gender</label>

            <div class="radio">

                <input type="radio" name="gender" value="Male" required> Male

                <input type="radio" name="gender" value="Female"> Female

                <input type="radio" name="gender" value="Other"> Other

            </div>

            <label>Hobbies</label>

            <div class="check">

                <input type="checkbox" name="hobbies[]" value="Reading"> Reading

                <input type="checkbox" name="hobbies[]" value="Music"> Music

                <input type="checkbox" name="hobbies[]" value="Sports"> Sports

                <input type="checkbox" name="hobbies[]" value="Coding"> Coding

            </div>

            <label>Address</label>

            <textarea name="address" rows="4" required></textarea>

            <button type="submit">Register</button>

        </form>

    </div>

</body>

</html>