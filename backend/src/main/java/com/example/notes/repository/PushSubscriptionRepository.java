package com.example.notes.repository;

import com.example.notes.model.PushSubscription;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class PushSubscriptionRepository {

    private final JdbcTemplate jdbcTemplate;

    public PushSubscriptionRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public void save(PushSubscription subscription) {

    String checkSql =
            "SELECT COUNT(*) FROM push_subscriptions WHERE endpoint = ?";

    Integer count = jdbcTemplate.queryForObject(
            checkSql,
            Integer.class,
            subscription.getEndpoint()
    );

    if (count != null && count > 0) {

        String updateSql =
                "UPDATE push_subscriptions " +
                "SET user_id = ?, p256dh = ?, auth = ? " +
                "WHERE endpoint = ?";

        jdbcTemplate.update(
                updateSql,
                subscription.getUserId(),
                subscription.getP256dh(),
                subscription.getAuth(),
                subscription.getEndpoint()
        );

    } else {

        String insertSql =
                "INSERT INTO push_subscriptions " +
                "(user_id, endpoint, p256dh, auth) " +
                "VALUES (?, ?, ?, ?)";

        jdbcTemplate.update(
                insertSql,
                subscription.getUserId(),
                subscription.getEndpoint(),
                subscription.getP256dh(),
                subscription.getAuth()
        );
    }
}

    public List<PushSubscription> findByUserId(Integer userId) {

        String sql =
                "SELECT subscription_id, user_id, endpoint, p256dh, auth " +
                "FROM push_subscriptions " +
                "WHERE user_id = ?";

        return jdbcTemplate.query(
                sql,
                (rs, rowNum) -> {
                    PushSubscription subscription =
                            new PushSubscription();

                    subscription.setSubscriptionId(
                            rs.getInt("subscription_id")
                    );

                    subscription.setUserId(
                            rs.getInt("user_id")
                    );

                    subscription.setEndpoint(
                            rs.getString("endpoint")
                    );

                    subscription.setP256dh(
                            rs.getString("p256dh")
                    );

                    subscription.setAuth(
                            rs.getString("auth")
                    );

                    return subscription;
                },
                userId
        );
    }
}