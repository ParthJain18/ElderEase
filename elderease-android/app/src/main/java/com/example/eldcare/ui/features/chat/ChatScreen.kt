package com.example.eldcare.ui.features.chat

import android.net.Uri
import android.speech.tts.TextToSpeech
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Menu
import androidx.compose.material.icons.filled.Send
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.eldcare.R
import com.example.eldcare.controllers.apis.getResponse
import com.example.eldcare.controllers.apis.sendImageToBackend
import com.example.eldcare.ui.CustomTopAppBar
import com.example.eldcare.ui.MessageCard
import com.example.eldcare.ui.features.reminders.sendReminder
import kotlinx.coroutines.DelicateCoroutinesApi
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

@OptIn(DelicateCoroutinesApi::class)
@Composable
fun ChatTextField(viewModel: ChatViewModel, textToSpeech: TextToSpeech, isSpeakerOn: Boolean) {
    var newMessage by remember { mutableStateOf("") }
    val context = LocalContext.current
    val imageUri = remember { mutableStateOf<Uri?>(null) }
    var showDialog by remember { mutableStateOf(false) }
    var caption by remember { mutableStateOf("") }
    val filePickerLauncher = rememberLauncherForActivityResult(ActivityResultContracts.OpenDocument()) { uri ->
        uri?.let {
            imageUri.value = it
            showDialog = true
        }
    }

    if (showDialog) {
        AlertDialog(
            onDismissRequest = { showDialog = false },
            title = { Text("Add a caption") },
            text = {
                OutlinedTextField(
                    value = caption,
                    onValueChange = { caption = it },
                    label = { Text("Caption") }
                )
            },
            confirmButton = {
                Button(
                    onClick = {
                        imageUri.value?.let { uri ->
                            viewModel.sendMessage(
                                uri.toString(),
                                true,
                                isImage = true,
                                caption = caption
                            )
                            sendImageToBackend(context, uri, user_input = caption, callback = {
                                if (it != null && it.chat.isNotBlank()) {
                                    viewModel.sendMessage(it.chat, false)
                                    if (isSpeakerOn) {
                                        textToSpeech.speak(it.chat, TextToSpeech.QUEUE_FLUSH, null, null)
                                    }
                                }
                            })
                        }
                        showDialog = false
                        caption = ""
                    }
                ) {
                    Text("Send")
                }
            },
            dismissButton = {
                Button(onClick = { showDialog = false }) {
                    Text("Cancel")
                }
            }
        )
    }

    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(8.dp)
            .background(Color.Transparent),
        verticalAlignment = Alignment.CenterVertically
    ) {
        OutlinedTextField(
            value = newMessage,
            onValueChange = { newMessage = it },
            modifier = Modifier
                .weight(1f)
                .padding(8.dp),
            shape = RoundedCornerShape(100.dp),
            placeholder = { Text(stringResource(R.string.type_a_message)) }
        )
        IconButton(onClick = { filePickerLauncher.launch(arrayOf("image/*")) }) {
            Icon(imageVector = Icons.Filled.Menu, contentDescription = "Select or Capture Image")
        }
        VoiceInputButton { spokenText ->
            newMessage = spokenText
        }
        IconButton(
            onClick = {
                val msg = newMessage.trim()
                if (msg.isBlank()) return@IconButton
                GlobalScope.launch {
                    val response = getResponse(context, msg) {
                        if (it == null) return@getResponse
                        if (it.chat.startsWith("[")) {
                            sendReminder(it.chat, context)
                            return@getResponse
                        }
                        viewModel.sendMessage(it.chat, false)
                        if (isSpeakerOn) {
                            textToSpeech.speak(it.chat, TextToSpeech.QUEUE_FLUSH, null, null)
                        }
                    }
                }
                viewModel.sendMessage(msg, true)
                newMessage = ""
            },
            modifier = Modifier
                .clip(CircleShape)
                .background(MaterialTheme.colorScheme.primary)
        ) {
            Icon(
                imageVector = Icons.Filled.Send,
                contentDescription = "Send",
                modifier = Modifier
                    .size(48.dp)
                    .padding(8.dp),
                tint = MaterialTheme.colorScheme.onPrimary
            )
        }
    }
}
@Composable
fun ChatScreen(viewModel: ChatViewModel = viewModel(), onNavIconClick: () -> Unit = {}) {
    val messages = viewModel.messages.collectAsState()
    val listState = rememberLazyListState()
    val context = LocalContext.current
    var isSpeakerOn by remember { mutableStateOf(true) }
    val textToSpeech = remember { TextToSpeech(context) { } }

    CustomTopAppBar(
        title = stringResource(R.string.eld_care),
        navIcon = {
            IconButton(
                onClick = { onNavIconClick() },
                modifier = Modifier
                    .padding(horizontal = 12.dp)
            ) {
                Icon(
                    imageVector = Icons.Filled.Menu,
                    contentDescription = "Back",
                    modifier = Modifier.size(30.dp)
                )
            }
        },
        isSpeakerOn = isSpeakerOn,
        onSpeakerToggle = { isSpeakerOn = !isSpeakerOn }
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .background(MaterialTheme.colorScheme.surface)
        ) {
            LazyColumn(
                modifier = Modifier
                    .weight(1f),
                verticalArrangement = Arrangement.Bottom,
                state = listState,
            ) {
                items(messages.value.size) { index ->
                    MessageCard(
                        message = messages.value[index]
                    )
                }
            }
            ChatTextField(viewModel = viewModel, textToSpeech = textToSpeech, isSpeakerOn = isSpeakerOn)
        }
    }
    LaunchedEffect(key1 = messages.value) {
        delay(100)
        if (messages.value.isEmpty()) return@LaunchedEffect
        listState.animateScrollToItem(index = messages.value.size - 1)
    }
}