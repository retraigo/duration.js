import Duration from "../../mod.ts";
import { assertEquals } from "jsr:@std/assert";

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
      "0 days, 0 hours, 2 minutes, 1 second, 920 milliseconds, 0 microseconds, 0 nanoseconds",
    );
    assertEquals(
      duration1.toDescriptiveString(true),
      "2 minutes, 1 second, 920 milliseconds",
    );

    assertEquals(
      duration1.toWordString(),
      "zero days, zero hours, two minutes, one second, nine hundred and twenty milliseconds, zero microseconds, zero nanoseconds",
    );
    assertEquals(
      duration1.toWordString(true),
      "two minutes, one second, nine hundred and twenty milliseconds",
    );
  },
});
