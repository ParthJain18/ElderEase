package com.example.eldcare.controllers

import android.content.Context
import android.util.Log
import android.widget.Toast
import com.example.eldcare.controllers.apis.ApiService
import com.example.eldcare.models.Users
import com.example.eldcare.utils.SessionManager
import com.google.firebase.auth.UserProfileChangeRequest
import com.google.firebase.auth.ktx.auth
import com.google.firebase.ktx.Firebase
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

fun signupFirebase(userObj: Users, context: Context, callback: (Boolean) -> Unit) {
    val TAG = "signUp"
    val auth = Firebase.auth

    Log.d(TAG, "signUp: ${userObj.email}")

    if (userObj.email.isEmpty() || userObj.password.isEmpty()) {
        Toast.makeText(context, "Email or password is empty", Toast.LENGTH_SHORT).show()
        callback(false)
        return
    }

    auth.createUserWithEmailAndPassword(userObj.email, userObj.password)
        .addOnCompleteListener { task ->
            if (task.isSuccessful) {
                val user = auth.currentUser
                val profileUpdates = UserProfileChangeRequest.Builder()
                    .setDisplayName(userObj.name)
                    .build()
                user?.updateProfile(profileUpdates)
                    ?.addOnCompleteListener { profileUpdateTask ->
                        if (profileUpdateTask.isSuccessful) {
                            user.getIdToken(true)
                                .addOnCompleteListener { tokenTask ->
                                    if (tokenTask.isSuccessful) {
                                        val idToken = tokenTask.result?.token
                                        val retrofit = Retrofit.Builder()
                                            .baseUrl(context.getString(com.example.eldcare.R.string.backend_url))
                                            .addConverterFactory(GsonConverterFactory.create())
                                            .build()
                                        val apiService = retrofit.create(ApiService::class.java)

                                        val tokenData = mapOf("id_token" to idToken)
                                        Log.d(TAG, "signUp token: $idToken")

                                        val call = apiService.signupUser(tokenData)
                                        call.enqueue(object : Callback<Map<String, String>> {
                                            override fun onResponse(
                                                call: Call<Map<String, String>>,
                                                response: Response<Map<String, String>>
                                            ) {
                                                if (response.isSuccessful) {
                                                    val jwtToken = response.body()?.get("access_token")
                                                    if (jwtToken != null) {
                                                        val sessionManager = SessionManager(context)
                                                        sessionManager.saveAuthToken(jwtToken)
                                                        Log.d(TAG, "JWT token saved successfully.")
                                                        callback(true)
                                                    } else {
                                                        Log.d(TAG, "Failed to retrieve JWT token.")
                                                        callback(false)
                                                    }
                                                } else {
                                                    Log.d(TAG, "Failed to send auth token.")
                                                    callback(false)
                                                }
                                            }

                                            override fun onFailure(call: Call<Map<String, String>>, t: Throwable) {
                                                Log.d(TAG, "Failed to send auth token.")
                                                callback(false)
                                            }
                                        })
                                    } else {
                                        Log.w(TAG, "getIdToken:failure", tokenTask.exception)
                                        Toast.makeText(context, "Failed to get auth token.", Toast.LENGTH_SHORT).show()
                                        callback(false)
                                    }
                                }
                        } else {
                            Log.w(TAG, "createUserWithEmail:failure", task.exception)
                            Toast.makeText(context, "Authentication failed.", Toast.LENGTH_SHORT).show()
                            callback(false)
                        }
                    }
            } else {
                Log.w(TAG, task.exception?.message ?: "Authentication Failed", task.exception)
                Toast.makeText(context, task.exception?.message ?: "Authentication Failed", Toast.LENGTH_LONG).show()
                callback(false)
            }
        }
}