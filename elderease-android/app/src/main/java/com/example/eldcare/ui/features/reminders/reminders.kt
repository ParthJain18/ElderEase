package com.example.eldcare.ui.features.reminders

import android.app.AlertDialog
import android.content.Context
import android.util.Log
import com.example.eldcare.ui.features.chat.ChatViewModel
import com.google.firebase.Firebase
import com.google.firebase.auth.auth
import com.google.firebase.database.FirebaseDatabase
import com.google.firebase.firestore.FirebaseFirestore

fun sendReminder(data: String, context: Context, viewModel: ChatViewModel = ChatViewModel()) {

//    Log.d("sendReminder", "sendReminder: $reminderString")
//    val data = "[2024-01-28T18:00:00.000Z, 2024-01-28T19:00:00.000Z, Go for a walk]"
    val splitData = data.split(",")
    //get the title
    val title = splitData[2].substring(0, splitData[2].length - 1).trim()
    //get the start time
    val startTime = splitData[0].substring(1, splitData[0].length).trim()
    //get the end time
    val endTime = splitData[1].substring(0, splitData[1].length).trim()

    Log.d("sendReminder", "sendReminder: $title")
    Log.d("sendReminder", "sendReminder: $startTime")
    Log.d("sendReminder", "sendReminder: $endTime")
    val builder = AlertDialog.Builder(context)
    builder.setTitle("Set Reminder")
    builder.setMessage("Do you want to set a reminder for $title at ${startTime.substring(0, startTime.length - 5)}?")
    builder.setPositiveButton("Yes") { dialog, which ->
        // Code to set the reminder
        dialog.dismiss()
        val db = FirebaseDatabase.getInstance()
        val auth = Firebase.auth
        val currentUser = auth.currentUser
        val userId = currentUser?.uid
        val TAG = "sendReminder"

        viewModel.sendMessage("Done!", false)



        val reminder = hashMapOf(
            "title" to title,
            "startDate" to startTime,
            "endDate" to endTime,
        )
        if (userId != null) {
            val random = (0..100000).random()
            db.getReference("schedule").child(userId).child(random.toString()).setValue(reminder)
                .addOnSuccessListener {
                    Log.d(TAG, "Reminder added.")
                }
                .addOnFailureListener {
                    Log.d(TAG, "Failed to add reminder.")
                }
        }

    }
    builder.setNegativeButton("No") { dialog, which ->
        dialog.dismiss()
    }
    builder.show()
}