create view public.overview_total(day, amount) as
SELECT hours.day,
       sum(hours.time_diff::interval) AS amount
FROM hours
GROUP BY hours.day
ORDER BY hours.day;
