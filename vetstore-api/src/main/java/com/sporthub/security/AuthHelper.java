package com.sporthub.security;

import com.sporthub.entity.User;
import com.sporthub.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AuthHelper {

    private final UserRepository userRepository;

    public Long getCurrentUserId() {

        Authentication authentication =
                SecurityContextHolder.getContext()
                        .getAuthentication();

        if (authentication == null
                || !authentication.isAuthenticated()) {
            throw new RuntimeException("Chưa đăng nhập");
        }

        Object principal = authentication.getPrincipal();

        String username;

        if (principal instanceof UserDetails userDetails) {
            username = userDetails.getUsername();
        } else {
            username = principal.toString();
        }

        User user = userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Không tìm thấy user: " + username
                        )
                );

        return user.getId();
    }
}
