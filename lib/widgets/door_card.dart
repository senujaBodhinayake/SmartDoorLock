import 'dart:ui';
import 'package:flutter/material.dart';
import '../models/door.dart';
import '../widgets/custom_button.dart';
import '../widgets/activity_tile.dart';
import '../models/activity.dart';

class DoorCard extends StatefulWidget {
  final Door door;

  const DoorCard({super.key, required this.door});

  @override
  State<DoorCard> createState() => _DoorCardState();
}

class _DoorCardState extends State<DoorCard> {
  void _toggleLock() {
    setState(() {
      widget.door.isLocked = !widget.door.isLocked;
      widget.door.activityLog.insert(
        0,
        Activity(
          action: widget.door.isLocked ? "Locked by You" : "Unlocked by You",
          time: "Just now",
          locked: widget.door.isLocked,
        ),
      );
    });

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text("${widget.door.name} ${widget.door.isLocked ? "locked" : "unlocked"}")),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(widget.door.name,
            style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: Colors.white)),
        SizedBox(height: 20),

        Center(
          child: ClipRRect(
            borderRadius: BorderRadius.circular(100),
            child: BackdropFilter(
              filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
              child: Container(
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.2),
                  shape: BoxShape.circle,
                  border: Border.all(color: Colors.white.withOpacity(0.3)),
                ),
                child: CustomButton(
                  text: widget.door.isLocked ? "Tap to Unlock" : "Tap to Lock",
                  icon: widget.door.isLocked ? Icons.lock : Icons.lock_open,
                  onPressed: _toggleLock,
                ),
              ),
            ),
          ),
        ),
        SizedBox(height: 20),
        Text("Recent Activity", style: TextStyle(fontSize: 18, color: Colors.white)),
        SizedBox(height: 10),
        ...widget.door.activityLog.map((activity) => ActivityTile(activity: activity)),
        SizedBox(height: 30),
      ],
    );
  }
}