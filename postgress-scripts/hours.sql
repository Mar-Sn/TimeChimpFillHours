create table public.hours
(
    id          integer generated always as identity
        constraint hours_pk
            primary key,
    day         date                                              not null,
    customer    text                                              not null,
    project     text                                              not null,
    task        text                                              not null,
    "from"      time                                              not null,
    "to"        time                                              not null,
    description text                                              not null,
    processed   boolean default false                             not null,
    time_diff   time generated always as (("to" - "from")) stored not null
);
