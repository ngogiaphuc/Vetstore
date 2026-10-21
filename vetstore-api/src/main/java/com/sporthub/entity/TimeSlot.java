package com.sporthub.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "time_slots", uniqueConstraints = {
    @UniqueConstraint(name = "uk_time_slots_start_end",
        columnNames = {"start_time", "end_time"})
})
@Getter
@Setter
@NoArgsConstructor
public class TimeSlot {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "start_time", nullable = false)
    private LocalTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalTime endTime;

    @Column(length = 30)
    private String status = "ACTIVE";

    @OneToMany(mappedBy = "timeSlot")
    private List<CourtPrice> prices = new ArrayList<>();

}
