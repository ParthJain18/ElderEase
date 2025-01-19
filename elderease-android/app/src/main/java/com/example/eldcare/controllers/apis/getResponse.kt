package com.example.eldcare.controllers.apis

import android.content.Context
import android.net.Uri
import android.util.Log
import com.example.eldcare.models.ChatRequest
import com.example.eldcare.models.ChatResponse
import com.google.firebase.Firebase
import com.google.firebase.auth.auth
import okhttp3.MultipartBody
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import java.io.File
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.RequestBody.Companion.asRequestBody
import okhttp3.RequestBody.Companion.toRequestBody
import java.io.FileOutputStream
import java.io.InputStream


fun getResponse(context: Context, user_input: String, callback: (ChatResponse?) -> Unit) {
    val userId = Firebase.auth.currentUser?.uid ?: "0"
    val chatRequest = ChatRequest(user_input, userId)
    val retrofit = createRetrofit(context)
    val api = retrofit.create(ChatAPI::class.java)
    val call = api.getChat(chatRequest)
    Log.d("HTTP", chatRequest.toString())

    call.enqueue(object : Callback<ChatResponse> {
        override fun onResponse(call: Call<ChatResponse>, response: Response<ChatResponse>) {
            if (response.isSuccessful) {
                val chatResponse = response.body()
                if (chatResponse != null) {
                    Log.d("HTTPSuccess", chatResponse.chat)
                    callback(chatResponse)
                }
            } else {
                Log.d("HTTPFail", "Response not successful. Error code: ${response.code()}, Error message: ${response.errorBody()?.string()}")
            }
        }

        override fun onFailure(call: Call<ChatResponse>, t: Throwable) {
            Log.d("HTTPFail1", t.toString())
        }
    })
}

fun sendImageToBackend(context: Context, imageUri: Uri, user_input: String, callback: (ChatResponse?) -> Unit) {
    val retrofit = createRetrofit(context)
    val api = retrofit.create(ChatAPI::class.java)

    val inputStream: InputStream? = context.contentResolver.openInputStream(imageUri)
    val file = File(context.cacheDir, "upload_image.jpg")
    val outputStream = FileOutputStream(file)

    inputStream?.use { input ->
        outputStream.use { output ->
            input.copyTo(output)
        }
    }

    val requestFile = file.asRequestBody("image/jpeg".toMediaTypeOrNull())
    val body = MultipartBody.Part.createFormData("image", file.name, requestFile)
    val caption = user_input.toRequestBody("text/plain".toMediaTypeOrNull())
    val call = api.uploadImage(body, caption)

    call.enqueue(object : Callback<ChatResponse> {
        override fun onResponse(call: Call<ChatResponse>, response: Response<ChatResponse>) {
            if (response.isSuccessful) {
                val chatResponse = response.body()
                if (chatResponse != null) {
                    Log.d("HTTPSuccess", chatResponse.chat)
                    callback(chatResponse)
                }
            } else {
                Log.d("HTTPFail", "Response not successful. Error code: ${response.code()}, Error message: ${response.errorBody()?.string()}")
            }
        }

        override fun onFailure(call: Call<ChatResponse>, t: Throwable) {
            Log.d("HTTPFail1", t.toString())
            callback(null)
        }
    })
}