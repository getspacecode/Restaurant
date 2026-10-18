package com.spacecode.server.controllers;

import com.spacecode.server.dtos.ReservationInput;
import com.spacecode.server.entities.Reservation;
import com.spacecode.server.services.ReservationService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class ReservationController {
  private final ReservationService reservationService;

  @MutationMapping
  public boolean createReservation(@Argument ReservationInput input) {
    reservationService.save(input);
    return true;
  }

  @QueryMapping
  public List<Reservation> reservations() {
    return reservationService.getAll();
  }

  @MutationMapping
  public boolean changeReservation(@Argument Integer id, @Argument ReservationInput input) {
    reservationService.change(id, input);
    return true;
  }
}
