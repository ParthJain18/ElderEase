package com.example.eldcare.controllers.apis

import com.example.eldcare.models.ChatRequest
import com.example.eldcare.models.ChatResponse
import okhttp3.MultipartBody
import okhttp3.RequestBody
import retrofit2.Call
import retrofit2.http.Body
import retrofit2.http.Multipart
import retrofit2.http.POST
import retrofit2.http.Part

interface ApiService {
    @POST("auth/login")
    fun signupUser(@Body tokenData: Map<String, String?>): Call<Map<String, String>>

    @POST("/location/location")
    fun updateLocation(@Body locationData: Map<String, String>): Call<Void>

    @POST("/chat")
    fun getChat(@Body chatRequest: ChatRequest): Call<ChatResponse>
}

interface ChatAPI {
    @POST("/chat/chat")
    fun getChat(@Body chatRequest: ChatRequest): Call<ChatResponse>

    @Multipart
    @POST("/chat/upload_image")
    fun uploadImage(
        @Part image: MultipartBody.Part,
        @Part("caption") caption: RequestBody
    ): Call<ChatResponse>
}