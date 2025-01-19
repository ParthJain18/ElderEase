package com.example.eldcare.controllers

import android.content.Context
import android.util.Log
import android.widget.Toast
import com.example.eldcare.controllers.apis.ApiService
import com.example.eldcare.utils.SessionManager
import com.google.firebase.auth.ktx.auth
import com.google.firebase.ktx.Firebase
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

fun loginFirebase(email: String, password: String, context: Context, callback: (Boolean) -> Unit) {
    val TAG = "login"
    val auth = Firebase.auth

    Log.d(TAG, "login: $email")

    if (email.isEmpty() || password.isEmpty()) {
        Toast.makeText(context, "Email or password is empty", Toast.LENGTH_SHORT).show()
        callback(false)
        return
    }

    auth.signInWithEmailAndPassword(email, password)
        .addOnCompleteListener { task ->
            if (task.isSuccessful) {
                val user = auth.currentUser
                user?.getIdToken(true)
                    ?.addOnCompleteListener { tokenTask ->
                        if (tokenTask.isSuccessful) {
                            val idToken = tokenTask.result?.token
                            val retrofit = Retrofit.Builder()
                                .baseUrl(context.getString(com.example.eldcare.R.string.backend_url))
                                .addConverterFactory(GsonConverterFactory.create())
                                .build()
                            val apiService = retrofit.create(ApiService::class.java)

                            val tokenData = mapOf("id_token" to idToken)
                            Log.d(TAG, "login token: $idToken")

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
                Log.w(TAG, task.exception?.message ?: "Authentication Failed", task.exception)
                Toast.makeText(context, task.exception?.message ?: "Authentication Failed", Toast.LENGTH_LONG).show()
                callback(false)
            }
        }
}