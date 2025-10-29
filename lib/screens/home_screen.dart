import 'package:flutter/material.dart';
import '../models/user.dart';
import '../models/door.dart';
import '../models/activity.dart';
import '../widgets/door_card.dart';
import '../screens/profile_screen.dart';

class HomeScreen extends StatelessWidget {
  final User user;

  HomeScreen({super.key, required this.user});

  final List<Door> doors = [
    Door(name: "Front Door", activityLog: [
      Activity(action: "Locked by You", time: "2 minutes ago", locked: true),
      Activity(action: "Unlocked by You", time: "1 hour ago", locked: false),
    ]),
    Door(name: "Garage Door", activityLog: [
      Activity(action: "Locked by You", time: "10 minutes ago", locked: true),
    ]),
    Door(name: "Back Door", activityLog: [
      Activity(action: "Unlocked by You", time: "30 minutes ago", locked: false),
    ]),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: EdgeInsets.all(20),
          child: Column(
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    "Welcome ${user.name}",
                    style: TextStyle(
                      fontSize: 28,
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  IconButton(
                    icon: Icon(Icons.person, color: Colors.white),
                    onPressed: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (_) => ProfileScreen(user: user, doors: doors),
                        ),
                      );
                    },
                  ),
                ],
              ),
              SizedBox(height: 30),
              ...doors.map((door) => DoorCard(door: door)),
            ],
          ),
        ),
      ),
    );
  }
}