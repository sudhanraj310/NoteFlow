package com.example.notes.repository;

import java.sql.PreparedStatement;
import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import com.example.notes.model.User;

@Repository
public class UserRepository {

    private final JdbcTemplate jdbcTemplate;

    public UserRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    // Find user by username
    public Optional<User> findByUsername(String username) {

        List<User> users = jdbcTemplate.query(
                "SELECT user_id, username, password, created_at " +
                "FROM users WHERE username = ?",
                userRowMapper,
                username
        );

        return users.stream().findFirst();
    }

    // Find user by ID
    public Optional<User> findById(int userId) {

        List<User> users = jdbcTemplate.query(
                "SELECT user_id, username, password, created_at " +
                "FROM users WHERE user_id = ?",
                userRowMapper,
                userId
        );

        return users.stream().findFirst();
    }

  // Create new user
public User save(User user) {

    String sql =
            "INSERT INTO users (username, password) " +
            "VALUES (?, ?)";

    KeyHolder keyHolder = new GeneratedKeyHolder();

    jdbcTemplate.update(connection -> {

        PreparedStatement ps =
                connection.prepareStatement(
                        sql,
                        new String[]{"user_id"}
                );

        ps.setString(1, user.getUsername());
        ps.setString(2, user.getPassword());

        return ps;

    }, keyHolder);

    Number key = keyHolder.getKey();

    if (key != null) {
        return findById(key.intValue()).orElse(user);
    }

    return user;
}
    // Check whether username already exists
    public boolean existsByUsername(String username) {

        Integer count = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM users WHERE username = ?",
                Integer.class,
                username
        );

        return count != null && count > 0;
    }

    // Convert database row into User object
    private final org.springframework.jdbc.core.RowMapper<User> userRowMapper =
            (rs, rowNum) -> {

                User user = new User();

                user.setUserId(rs.getInt("user_id"));
                user.setUsername(rs.getString("username"));
                user.setPassword(rs.getString("password"));

                Timestamp created =
                        rs.getTimestamp("created_at");

                if (created != null) {
                    user.setCreatedAt(
                            created.toLocalDateTime()
                    );
                }

                return user;
            };
}