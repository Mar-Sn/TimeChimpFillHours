create view public.overview_todo(day, amount) as
SELECT hours.day,
       sum(hours.time_diff::interval) AS amount
FROM hours
GROUP BY hours.day
HAVING sum(hours.time_diff::interval) < '08:00:00'::interval
ORDER BY hours.day;
