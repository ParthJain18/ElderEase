package com.example.eldcare.ui.locations

import android.content.Context
import android.util.Log
import androidx.work.Worker
import androidx.work.WorkerParameters
import com.example.eldcare.R
import com.example.eldcare.controllers.apis.ApiService
import com.example.eldcare.controllers.apis.createRetrofit
import com.google.firebase.auth.FirebaseAuth
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

class LocationWorker(private val appContext: Context, workerParams: WorkerParameters):
    Worker(appContext, workerParams) {

    override fun doWork(): Result {
        GetLocation(applicationContext) { lat, lon ->
            // Update the location in the backend
            val auth = FirebaseAuth.getInstance()
            val userId = auth.currentUser?.uid.toString()

            val retrofit = createRetrofit(applicationContext)
            val apiService = retrofit.create(ApiService::class.java)

            val locationData = mapOf("userId" to userId, "latitude" to lat.toString(), "longitude" to lon.toString())
            val call = apiService.updateLocation(locationData)
            call.enqueue(object : Callback<Void> {
                override fun onResponse(call: Call<Void>, response: Response<Void>) {
                    if (response.isSuccessful) {
                        Log.d("LocationWorker", "Location updated to $lat, $lon")
                    } else {
                        Log.d("LocationWorker", "Failed to update location: ${response.errorBody()?.string()}")
                    }
                }

                override fun onFailure(call: Call<Void>, t: Throwable) {
                    Log.d("LocationWorker", "Failed to update location: $t")
                }
            })
        }
        return Result.success()
    }
}