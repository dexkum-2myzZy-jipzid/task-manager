# Task Manager App

## Overview

The Task Manager App is a mobile application developed using React Native and Expo. It integrates with Firebase to allow users to manage their tasks. Users can add, edit, delete, and view tasks. Additionally, the app features a leaderboard to track users who have completed the most tasks within specified periods (e.g., daily, weekly, monthly).

## Features

- [x] **Authentication**: Use Firebase Authentication to allow users to sign up, log in, and log out.
- [x] **Task Management**: Create, Read, Update, and Delete tasks using Firestore.
- [x] **Task List**: Display a list of tasks fetched from Firestore.

- [x] **Task Status**: Allow users to mark tasks as completed or not completed.

- [x] **Leaderboard**: Track the number of tasks each user completes and display the top users.
- [x] **Leaderboard**: Allow the leaderboard to be filtered by time periods (daily, weekly, monthly).

### Bouns

- [ ] **Notifications**: Include notifications for task reminders using Firebase Cloud Messaging.
  - iOS APNS requires a paid developer account, which I don’t have.
  - Android requires a physical device, which I also don’t have.
- [ ] **Unit Tests**: Write unit tests for critical parts of the application.
- [x] **Image Upload**: Upload images for tasks using Firebase Storage.
- [x] **Form Validation**: Implement form validation for the authentication and task forms.
- [x] **TypeScript**: Ensure type safety throughout the application.

## Installation

### Setup

1. Clone the repository:

```sh
git clone https://github.com/dexkum-2myzZy-jipzid/task-manager.git
cd task-manager
```

2. Install dependencies:

```sh
npm install
```

3. Configure Firebase (Option):

   If you want, you can replace the Firebase configuration in the `.env` file.

4. Run the project:

```sh
npm run start
```

## Test Account

You can create your own account or use one of these test accounts.

```text
account: tester0@test.com
Password: tester123
```

```
account: tester1@test.com
Password: tester123
```

```
account: tester2@test.com
Password: tester123
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License - see the [[LICENSE]](https://github.com/dexkum-2myzZy-jipzid/task-manager/blob/main/LICENSE) file for details.

## Contact

For any questions or feedback, please reach out to [liang.chen829@gmail.com].
