import 'dart:ui';
import 'package:flutter/material.dart';
import '../models/user.dart';
import '../models/door.dart';
import '../screens/login_screen.dart';

class ProfileScreen extends StatelessWidget {
  final User user;
  final List<Door> doors;

  const ProfileScreen({super.key, required this.user, required this.doors});

  void _logout(BuildContext context) {
    Navigator.pushReplacement(
      context,
      MaterialPageRoute(builder: (_) => const LoginScreen()),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: ClipRRect(
            borderRadius: BorderRadius.circular(20),
            child: BackdropFilter(
              filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
              child: Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.2),
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: Colors.white.withOpacity(0.3)),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      "Profile",
                      style: TextStyle(fontSize: 28, color: Colors.white, fontWeight: FontWeight.bold),
                    ),
                    SizedBox(height: 10),
                    Text(
                      "Logged in as: ${user.name}",
                      style: TextStyle(fontSize: 18, color: Colors.white70),
                    ),
                    SizedBox(height: 30),
                    Text(
                      "Door Summary",
                      style: TextStyle(fontSize: 20, color: Colors.white),
                    ),
                    SizedBox(height: 10),
                    ...doors.map((door) => ListTile(
                          leading: Icon(
                            door.isLocked ? Icons.lock : Icons.lock_open,
                            color: door.isLocked ? Colors.green : Colors.yellow,
                          ),
                          title: Text(door.name, style: TextStyle(color: Colors.white)),
                          subtitle: Text(
                            door.isLocked ? "Locked" : "Unlocked",
                            style: TextStyle(color: Colors.white70),
                          ),
                        )),
                    Spacer(),
                    Center(
                      child: ElevatedButton.icon(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.redAccent.withOpacity(0.8),
                          padding: EdgeInsets.symmetric(horizontal: 30, vertical: 15),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
                        ),
                        icon: Icon(Icons.logout, color: Colors.white),
                        label: Text("Logout", style: TextStyle(color: Colors.white)),
                        onPressed: () => _logout(context),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}