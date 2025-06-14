import Duration from "../../mod.ts";
import { assertEquals, assertGreater, assertLess } from "jsr:@std/assert";

Deno.test({
  name: "Default duration is a zero duration.",
  fn() {
    const duration = new Duration();
    assertEquals(duration, new Duration(0));
  },
});

Deno.test({
  name: "Zero duration has all zero values.",
  fn() {
    const duration = new Duration(0);
    assertEquals(duration.raw, 0);
    assertEquals(duration.nanoseconds, 0);
    assertEquals(duration.microseconds, 0);
    assertEquals(duration.milliseconds, 0);
    assertEquals(duration.seconds, 0);
    assertEquals(duration.minutes, 0);
    assertEquals(duration.hours, 0);
    assertEquals(duration.days, 0);
    assertEquals(duration.valueOf(), 0);
  },
});

Deno.test({
  name: "Adding two durations.",
  fn() {
    const duration1 = new Duration(121000);
    const duration2 = new Duration(119000);

    const diff = duration1.plus(duration2);
    assertEquals(diff, new Duration(240000));

    const diff2 = duration1.plus("119 seconds");
    assertEquals(diff2, new Duration(240000));
  },
});

Deno.test({
  name: "Subtracting from a duration.",
  fn() {
    const duration1 = new Duration(121000);
    const duration2 = new Duration(119000);

    const diff = duration1.minus(duration2);
    assertEquals(diff, new Duration(2000));

    const diff2 = duration1.minus("119 seconds");
    assertEquals(diff2, new Duration(2000));
  },
});

Deno.test({
  name: "Subtracting a negative duration.",
  fn() {
    const duration1 = new Duration(121000);
    const duration2 = new Duration(-119000);

    const diff = duration1.minus(duration2);
    assertEquals(diff, new Duration(121000 + 119000));
  },
});

Deno.test({
  name: "Testing string parsing.",
  fn() {
    const duration1 = new Duration("131 days, 50 hours, and 3600 secs");
    assertEquals(duration1, new Duration().setDays(133).setHours(3));
  },
});

Deno.test({
  name: "Testing stringifying.",
  fn() {
    const duration1 = new Duration(121920);
    assertEquals(duration1.toTimeString(), "00:00:02:01:920:000:000");
    assertEquals(duration1.toTimeString("s", "ms"), "01:920");

    assertEquals(duration1.toShortString(), "0d 0h 2m 1s 920ms 0us 0ns");
    assertEquals(duration1.toShortString(true), "2m 1s 920ms");

    assertEquals(
      duration1.toDescriptiveString(),
      "0 days, 0 hours, 2 minutes, 1 second, 920 milliseconds, 0 microseconds, 0 nanoseconds"
    );
    assertEquals(
      duration1.toDescriptiveString(true),
      "2 minutes, 1 second, 920 milliseconds"
    );
    assertEquals(
      duration1.toDescriptiveString(["m", "s"]),
      "2 minutes, 1 second"
    );

    assertEquals(
      duration1.toWordString(),
      "zero days, zero hours, two minutes, one second, nine hundred and twenty milliseconds, zero microseconds, zero nanoseconds"
    );
    assertEquals(
      duration1.toWordString(true),
      "two minutes, one second, nine hundred and twenty milliseconds"
    );

    assertEquals(
      duration1.toWordString(["m", "s"]),
      "two minutes, one second"
    );
  },
});

Deno.test("Absolute value of a negative duration", () => {
  const duration = new Duration("-5 seconds");
  assertEquals(duration.abs(), new Duration("5 seconds"));
});

Deno.test("Absolute value of a positive duration", () => {
  const duration = new Duration("5 seconds");
  assertEquals(duration.abs(), new Duration("5 seconds"));
});

Deno.test("Negating a duration", () => {
  const duration = new Duration("3 minutes");
  assertEquals(duration.negated(), new Duration("-3 minutes"));
});

Deno.test("Negating a negative duration", () => {
  const duration = new Duration("-3 minutes");
  assertEquals(duration.negated(), new Duration("-3 minutes"));
});

Deno.test("Setting and getting components", () => {
  const duration = new Duration()
    .setDays(2)
    .setHours(3)
    .setMinutes(15)
    .setSeconds(40)
    .setMilliseconds(500)
    .setMicroseconds(250)
    .setNanoseconds(100);

  assertEquals(duration.days, 2);
  assertEquals(duration.hours, 3);
  assertEquals(duration.minutes, 15);
  assertEquals(duration.seconds, 40);
  assertEquals(duration.milliseconds, 500);
  assertEquals(duration.microseconds, 250);
  assertEquals(duration.nanoseconds, 100);
});

Deno.test("Checking equality", () => {
  const a = new Duration("1 minute");
  const b = new Duration("60000 ms");
  const c = new Duration("30000 ms");
  assertEquals(a.equals(b), true);
  assertEquals(a.equals(c), false);
});

Deno.test("ISO 8601 parsing and stringifying", () => {
  const iso = "PT1H30M45.500S";
  const duration = new Duration(iso);
  assertEquals(duration.toISOString(), iso);

  const iso2 = "P15DT1H30M45.500S";
  const duration2 = new Duration(iso2);
  assertEquals(duration2.toISOString(), iso2);
});

Deno.test("Default .toString() returns short string", () => {
  const duration = new Duration(121920);
  assertEquals(duration.toString(), duration.toShortString());
});

Deno.test("Setters are chainable", () => {
  const d = new Duration().setMinutes(5).setSeconds(30);

  assertEquals(d.minutes, 5);
  assertEquals(d.seconds, 30);
});

Deno.test("Comparing durations", () => {
  const a = new Duration("60 seconds");
  const b = new Duration("1 minute");
  const c = new Duration("30 seconds");
  assertEquals(a.compareTo(b), 0);
  assertGreater(a.compareTo(c), 0);
  assertLess(c.compareTo(a), 0);
});
