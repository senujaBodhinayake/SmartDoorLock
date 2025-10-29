import 'activity.dart';

class Door {
  final String name;
  bool isLocked;
  List<Activity> activityLog;

  Door({
    required this.name,
    this.isLocked = true,
    required this.activityLog,
  });
}