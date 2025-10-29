import 'package:flutter/material.dart';

class CustomButton extends StatelessWidget {
  final String text;
  final IconData icon;
  final VoidCallback onPressed;

  const CustomButton({
    super.key,
    required this.text,
    required this.icon,
    required this.onPressed,
  });

  @override
  Widget build(BuildContext context) {
    return ElevatedButton(
      style: ElevatedButton.styleFrom(
        backgroundColor: Colors.white.withOpacity(0.3),
        shape: CircleBorder(),
        padding: EdgeInsets.all(40),
        elevation: 10,
      ),
      onPressed: onPressed,
      child: Column(
        children: [
          Icon(icon, color: Colors.white, size: 30),
          SizedBox(height: 10),
          Text(text, style: TextStyle(color: Colors.white)),
        ],
      ),
    );
  }
}