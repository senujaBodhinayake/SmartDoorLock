import '../models/user.dart';

class AuthService {
  static Future<User?> login(String userId) async {
    await Future.delayed(Duration(seconds: 1));
    if (userId.isNotEmpty) {
      return User(name: userId);
    }
    return null;
  }
}