import 'package:flutter/material.dart';
import 'screens/login_screen.dart';

void main() {
  runApp(SmartDoorLockApp());
}

class SmartDoorLockApp extends StatelessWidget {
  const SmartDoorLockApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Smart Door Lock',
      theme: ThemeData.dark(),
      home: LoginScreen(),
    );
  }
}