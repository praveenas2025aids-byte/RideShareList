package com.example.ridesharelist.service;

import com.example.ridesharelist.entity.RequestStatus;
import com.example.ridesharelist.entity.RideRequest;
import com.example.ridesharelist.entity.User;
import com.example.ridesharelist.exception.BusinessException;
import com.example.ridesharelist.repository.RideOfferRepository;
import com.example.ridesharelist.repository.RideRequestRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class RideRequestServiceTest {

    private RideRequestRepository rideRequestRepository;
    private RideRequestService rideRequestService;

    @BeforeEach
    void setUp() {
        rideRequestRepository = mock(RideRequestRepository.class);
        rideRequestService = new RideRequestService(
                rideRequestRepository,
                mock(RideOfferRepository.class));
    }

    @Test
    void cancelRequestSetsCancelledStatusForOwningRider() {
        User rider = new User();
        rider.setId(12L);
        RideRequest request = new RideRequest();
        request.setId(4L);
        request.setRider(rider);
        request.setStatus(RequestStatus.PENDING);
        when(rideRequestRepository.findById(4L)).thenReturn(Optional.of(request));
        when(rideRequestRepository.save(any(RideRequest.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        RideRequest cancelled = rideRequestService.cancelRequest(4L, 12L);

        assertEquals(RequestStatus.CANCELLED, cancelled.getStatus());
        verify(rideRequestRepository).save(request);
    }

    @Test
    void cancelRequestRejectsAnotherRider() {
        User rider = new User();
        rider.setId(12L);
        RideRequest request = new RideRequest();
        request.setRider(rider);
        request.setStatus(RequestStatus.PENDING);
        when(rideRequestRepository.findById(4L)).thenReturn(Optional.of(request));

        assertThrows(BusinessException.class,
                () -> rideRequestService.cancelRequest(4L, 99L));
        verify(rideRequestRepository, never()).save(any(RideRequest.class));
    }
}