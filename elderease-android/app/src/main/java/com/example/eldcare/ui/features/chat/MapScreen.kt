package com.example.eldcare.ui.features.chat

import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import com.example.eldcare.R
import com.example.eldcare.ui.CustomTopAppBar
import com.google.android.gms.maps.model.BitmapDescriptorFactory
import com.google.android.gms.maps.model.CameraPosition
import com.google.android.gms.maps.model.LatLng
import com.google.maps.android.compose.GoogleMap
import com.google.maps.android.compose.Marker
import com.google.maps.android.compose.rememberCameraPositionState
import com.google.maps.android.compose.rememberMarkerState

@Composable
fun MapScreen() {
    var isSpeakerOn by remember { mutableStateOf(true) }

    CustomTopAppBar(
        title = stringResource(R.string.map),
        isSpeakerOn = isSpeakerOn,
        onSpeakerToggle = { isSpeakerOn = !isSpeakerOn }
    ) {
        val mumbai = LatLng(19.0626, 72.8677)
        val nearbyLocations = listOf(
            LatLng(19.0726, 72.8777),
            LatLng(19.0526, 72.8577),
            LatLng(19.0626, 72.8477)
        )
        val cameraPositionState = rememberCameraPositionState {
            position = CameraPosition.fromLatLngZoom(mumbai, 10f)
        }
        GoogleMap(
            modifier = Modifier.fillMaxSize(),
            cameraPositionState = cameraPositionState
        ) {
            Marker(
                state = rememberMarkerState(position = mumbai),
                title = "Mumbai",
                snippet = "Your location"
            )
            nearbyLocations.forEach { location ->
                Marker(
                    state = rememberMarkerState(position = location),
                    title = "Elder Meetup",
                    snippet = "Marker in nearby location",
                    icon = BitmapDescriptorFactory.defaultMarker(BitmapDescriptorFactory.HUE_BLUE)
                )
            }
        }
    }
}