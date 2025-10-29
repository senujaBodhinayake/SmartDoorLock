import 'package:flutter/material.dart';
import '../models/activity.dart';

class ActivityTile extends StatelessWidget {
  final Activity activity;

  const ActivityTile({super.key, required this.activity});

  @override
  Widget build(BuildContext context) {
    return ListTile(
      leading: Icon(
        activity.locked ? Icons.lock : Icons.lock_open,
        color: activity.locked ? Colors.green : Colors.yellow,
      ),
      title: Text(activity.action, style: TextStyle(color: Colors.white)),
      subtitle: Text(activity.time, style: TextStyle(color: Colors.white70)),
    );
  }
}