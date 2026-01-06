function Manual() {
  return (
    <div className="container">
      <h1>Drone Component Calculator - Complete Beginner's Guide</h1>

      <h2>What Is This Thing?</h2>
      <p>
        This calculator helps you figure out if the drone parts you want to buy will actually work together and fly well. 
        Think of it like checking if your computer parts are compatible, but for drones.
      </p>
      <p><strong>What it tells you:</strong></p>
      <ul>
        <li>Will your drone be too heavy to fly properly?</li>
        <li>How long will the battery last?</li>
        <li>Is it powerful enough for racing or just cruising?</li>
        <li>Are you going to blow something up? (hopefully not!)</li>
      </ul>

      <h2>Before You Start</h2>
      <p>
        <strong>You'll need to know the specs of your parts.</strong> Find them on:
      </p>
      <ul>
        <li>Product pages where you buy parts</li>
        <li>Manufacturer websites</li>
        <li>User manuals</li>
        <li>Ask on drone forums if stuck</li>
      </ul>

      <h1>Understanding Each Input</h1>

      <h2>MOTORS</h2>

      <h3>Motor Count</h3>
      <ul>
        <li><strong>What it is:</strong> How many motors on your drone</li>
        <li><strong>Typical values:</strong> 4 (quadcopter), 6 (hexacopter), 8 (octocopter)</li>
        <li><strong>Example:</strong> Most racing/freestyle drones = 4 motors</li>
      </ul>

      <h3>Motor Weight (grams each)</h3>
      <ul>
        <li><strong>What it is:</strong> How heavy ONE motor is</li>
        <li><strong>Where to find it:</strong> Product page under "specifications"</li>
        <li><strong>Example:</strong> A typical 2207 motor weighs 28-35g</li>
        <li><strong>Don't forget:</strong> This is per motor, not total!</li>
      </ul>

      <h3>KV Rating</h3>
      <ul>
        <li><strong>What it is:</strong> How fast the motor spins per volt (RPM/Volt)</li>
        <li><strong>Higher KV = faster, less torque</strong></li>
        <li><strong>Lower KV = slower, more torque</strong></li>
        <li><strong>Typical values:</strong>
          <ul>
            <li>Racing drones: 2300-2700 KV</li>
            <li>Freestyle: 1800-2400 KV</li>
            <li>Cinematic: 1200-1800 KV</li>
          </ul>
        </li>
        <li><strong>Where to find it:</strong> The motor name usually has it (e.g., "2207 2450KV")</li>
      </ul>

      <h3>Max Current (Amps each)</h3>
      <ul>
        <li><strong>What it is:</strong> Maximum electrical current the motor can handle at full throttle</li>
        <li><strong>Where to find it:</strong> Motor specs page or datasheet</li>
        <li><strong>Example:</strong> 30A means the motor draws 30 amps at 100% throttle</li>
        <li><strong>Important:</strong> This is per motor!</li>
      </ul>

      <h3>Motor Efficiency (%)</h3>
      <ul>
        <li><strong>What it is:</strong> How well the motor converts electricity to motion (not heat)</li>
        <li><strong>Default value:</strong> 75% is typical for hobby motors</li>
        <li><strong>Leave it alone unless:</strong> You have specific motor test data</li>
      </ul>

      <h3>Use Measured Thrust Data (Checkbox)</h3>
      <p><strong>IMPORTANT OPTION!</strong></p>
      <p><strong>What it is:</strong> Instead of guessing, use real test data from motor benches</p>
      <p><strong>Should you use it?</strong></p>
      <ul>
        <li>YES if: You found actual thrust test results for your motor/prop combo</li>
        <li>NO if: You don't have this data (calculator will estimate)</li>
      </ul>
      <p><strong>Where to get it:</strong></p>
      <ul>
        <li>Motor manufacturer websites (look for "thrust test" or "motor database")</li>
        <li>YouTube reviews with motor benches</li>
        <li>Websites like miniquadtestbench.com or myairbot.com</li>
      </ul>
      <p><strong>If enabled, you'll enter:</strong></p>
      <ul>
        <li><strong>Thrust @ 100%:</strong> Grams of thrust at full throttle (per motor)</li>
        <li><strong>Thrust @ 50%:</strong> Grams of thrust at half throttle (per motor)</li>
      </ul>

      <h2>PROPELLERS</h2>

      <h3>Prop Size (inches)</h3>
      <ul>
        <li><strong>What it is:</strong> The diameter of the propeller</li>
        <li><strong>Typical values:</strong>
          <ul>
            <li>3 inch = tiny/micro drones</li>
            <li>5 inch = most common racing/freestyle</li>
            <li>7 inch = long-range cruising</li>
            <li>10 inch = heavy lifting/cinematic</li>
          </ul>
        </li>
        <li><strong>Example:</strong> "HQProp 5x4.3x3" - 5 inch is the size</li>
      </ul>

      <h3>Prop Pitch</h3>
      <ul>
        <li><strong>What it is:</strong> The angle of the propeller blades (affects speed vs efficiency)</li>
        <li><strong>Higher pitch = more speed, less efficiency</strong></li>
        <li><strong>Lower pitch = less speed, more efficiency</strong></li>
        <li><strong>Example:</strong> "5x4.3x3" - 4.3 is the pitch</li>
      </ul>

      <h2>BATTERY</h2>

      <h3>Cells (S)</h3>
      <ul>
        <li><strong>What it is:</strong> How many lithium cells in series (determines voltage)</li>
        <li><strong>Each cell = 3.7V nominal, 4.2V fully charged</strong></li>
        <li><strong>Common values:</strong>
          <ul>
            <li>3S = 11.1V (micro/beginner drones)</li>
            <li>4S = 14.8V (most common for 5" drones)</li>
            <li>6S = 22.2V (high performance/racing)</li>
          </ul>
        </li>
        <li><strong>On the battery:</strong> Look for "3S", "4S", "6S" on the label</li>
      </ul>

      <h3>Capacity (mAh)</h3>
      <ul>
        <li><strong>What it is:</strong> How much energy the battery stores (bigger = longer flight)</li>
        <li><strong>mAh = milliamp-hours</strong> (like gas tank size)</li>
        <li><strong>Typical values:</strong>
          <ul>
            <li>1000-1500 mAh = racing (lighter = faster)</li>
            <li>1500-1800 mAh = freestyle (balanced)</li>
            <li>2000-3000 mAh = long range (heavier = longer flight)</li>
          </ul>
        </li>
        <li><strong>On the battery:</strong> Written as "1500mAh" or "1.5Ah"</li>
      </ul>

      <h3>Battery Weight (grams)</h3>
      <ul>
        <li><strong>What it is:</strong> How heavy the battery is (very important!)</li>
        <li><strong>Where to find it:</strong> Product page or weigh it yourself</li>
        <li><strong>Example:</strong> A 4S 1500mAh battery typically weighs 150-200g</li>
        <li><strong>Remember:</strong> Heavier battery = more flight time BUT less performance</li>
      </ul>

      <h3>C Rating</h3>
      <ul>
        <li><strong>What it is:</strong> How fast the battery can discharge safely</li>
        <li><strong>Formula:</strong> Max safe current = (Capacity / 1000) x C Rating</li>
        <li><strong>Example:</strong> 1500mAh battery with 75C = can deliver 112.5A</li>
        <li><strong>Typical values:</strong>
          <ul>
            <li>50-75C = most common</li>
            <li>100C+ = high performance (marketing sometimes inflates this)</li>
          </ul>
        </li>
        <li><strong>On the battery:</strong> Written as "75C" or "100C"</li>
      </ul>

      <h3>Internal Resistance (mΩ per cell)</h3>
      <ul>
        <li><strong>What it is:</strong> How much the battery "fights" the current flow</li>
        <li><strong>Lower = better performance</strong></li>
        <li><strong>Default:</strong> 10 mΩ is typical for decent batteries</li>
        <li><strong>Advanced users:</strong> Measure with a battery tester</li>
        <li><strong>Beginners:</strong> Leave at 10</li>
      </ul>

      <h2>ESC (Electronic Speed Controller)</h2>

      <h3>ESC Weight (grams each)</h3>
      <ul>
        <li><strong>What it is:</strong> How heavy ONE ESC is</li>
        <li><strong>Where to find it:</strong> Product specs</li>
        <li><strong>Typical values:</strong>
          <ul>
            <li>4-in-1 ESC: divide total weight by 4</li>
            <li>Individual ESC: 5-12g each</li>
          </ul>
        </li>
        <li><strong>Example:</strong> A 35A 4-in-1 ESC at 32g total = 8g per ESC</li>
      </ul>

      <h3>ESC Efficiency (%)</h3>
      <ul>
        <li><strong>What it is:</strong> How much energy is lost as heat in the ESC</li>
        <li><strong>Default:</strong> 96% is typical for modern ESCs</li>
        <li><strong>Leave it alone unless:</strong> You have specific ESC test data</li>
      </ul>

      <h2>ELECTRONICS & OTHER PARTS</h2>

      <h3>Frame Weight (grams)</h3>
      <ul>
        <li><strong>What it is:</strong> The carbon fiber or plastic body</li>
        <li><strong>Where to find it:</strong> Product page</li>
        <li><strong>Typical:</strong> 80-150g for 5" frames</li>
      </ul>

      <h3>Flight Controller (FC) Weight (grams)</h3>
      <ul>
        <li><strong>What it is:</strong> The "brain" board that controls the drone</li>
        <li><strong>Typical:</strong> 5-10g</li>
      </ul>

      <h3>FC Current Draw (Amps)</h3>
      <ul>
        <li><strong>What it is:</strong> How much electricity the flight controller uses</li>
        <li><strong>Default:</strong> 0.5A is typical</li>
        <li><strong>Usually okay to leave:</strong> Unless you have a GPS or lots of LEDs</li>
      </ul>

      <h3>Camera Weight (grams)</h3>
      <ul>
        <li><strong>What it is:</strong> FPV camera weight</li>
        <li><strong>Typical:</strong> 10-20g for analog cameras</li>
      </ul>

      <h3>Camera Current (Amps)</h3>
      <ul>
        <li><strong>Default:</strong> 0.2A is typical for most FPV cameras</li>
      </ul>

      <h3>VTX (Video Transmitter) Weight (grams)</h3>
      <ul>
        <li><strong>What it is:</strong> Sends video signal to your goggles</li>
        <li><strong>Typical:</strong> 5-10g</li>
      </ul>

      <h3>VTX Current (Amps)</h3>
      <ul>
        <li><strong>What it is:</strong> Power the VTX uses</li>
        <li><strong>Depends on power level:</strong>
          <ul>
            <li>25mW = 0.2A</li>
            <li>200mW = 0.3A</li>
            <li>600mW = 0.5A</li>
            <li>1W+ = 0.7A+</li>
          </ul>
        </li>
      </ul>

      <h3>Receiver (RX) Weight (grams)</h3>
      <ul>
        <li><strong>What it is:</strong> Receives signals from your radio controller</li>
        <li><strong>Typical:</strong> 1-5g</li>
      </ul>

      <h3>Receiver Current (Amps)</h3>
      <ul>
        <li><strong>Default:</strong> 0.1A is typical</li>
      </ul>

      <h3>Other Weight (grams)</h3>
      <ul>
        <li><strong>What it is:</strong> Everything else (screws, zip ties, wires, GoPro, etc.)</li>
        <li><strong>Typical:</strong> 30-50g</li>
        <li><strong>Don't forget:</strong> GoPro adds ~100g!</li>
      </ul>

      <h2>FLIGHT PARAMETERS</h2>

      <h3>Average Throttle (%)</h3>
      <ul>
        <li><strong>What it is:</strong> How much throttle you use on average during a typical flight</li>
        <li><strong>Affects:</strong> Flight time calculation</li>
        <li><strong>Typical values:</strong>
          <ul>
            <li>30-40% = gentle cruising</li>
            <li>50-60% = active freestyle flying</li>
            <li>70%+ = racing</li>
          </ul>
        </li>
        <li><strong>Start with:</strong> 50% and adjust based on your flying style</li>
      </ul>

      <h3>Hover Throttle (%)</h3>
      <ul>
        <li><strong>What it is:</strong> Throttle needed to hover in place (not moving)</li>
        <li><strong>Typical:</strong> 25-40%</li>
        <li><strong>Lower = more efficient drone</strong></li>
        <li><strong>Formula:</strong> Should be roughly 100 / thrust-to-weight ratio x 100</li>
      </ul>

      <h1>Understanding the Results</h1>

      <h2>Top Stats Cards</h2>

      <h3>Total Weight</h3>
      <ul>
        <li><strong>What it shows:</strong> Everything added up</li>
        <li><strong>Good values:</strong>
          <ul>
            <li>5" racing: 400-550g</li>
            <li>5" freestyle: 500-700g</li>
            <li>5" long-range: 700-900g (with big battery)</li>
          </ul>
        </li>
      </ul>

      <h3>Max Thrust</h3>
      <ul>
        <li><strong>What it shows:</strong> Maximum power all motors combined</li>
        <li><strong>What you want:</strong> At LEAST 2x your total weight</li>
        <li><strong>Better:</strong> 3-4x for good flying</li>
      </ul>

      <h3>Thrust-to-Weight Ratio</h3>
      <p><strong>THE MOST IMPORTANT NUMBER!</strong></p>
      <ul>
        <li><strong>What it shows:</strong> How much thrust vs how heavy the drone is</li>
        <li><strong>Values:</strong>
          <ul>
            <li><strong>Below 2:1</strong> = Won't fly well, sluggish, dangerous</li>
            <li><strong>2:1 to 2.5:1</strong> = Will fly but not fun, slow</li>
            <li><strong>2.5:1 to 3.5:1</strong> = Good for cruising/cinematic</li>
            <li><strong>3.5:1 to 5:1</strong> = Great for freestyle, plenty of power</li>
            <li><strong>Above 5:1</strong> = Racing beast, very fast, hard to control</li>
          </ul>
        </li>
      </ul>

      <h3>Flight Time</h3>
      <ul>
        <li><strong>What it shows:</strong> Estimated minutes of flight</li>
        <li><strong>Remember:</strong> This is THEORETICAL</li>
        <li><strong>Real world:</strong> Subtract 20-30% for aggressive flying</li>
        <li><strong>Typical:</strong>
          <ul>
            <li>Racing: 2-4 minutes</li>
            <li>Freestyle: 3-5 minutes</li>
            <li>Cruising: 5-8 minutes</li>
            <li>Long-range: 10-20+ minutes</li>
          </ul>
        </li>
      </ul>

      <h3>Power Draw</h3>
      <ul>
        <li><strong>What it shows:</strong> How much power you're using at your average throttle</li>
        <li><strong>Measured in:</strong> Watts (W) and Amps (A)</li>
        <li><strong>Check:</strong> Make sure total amps don't exceed battery C rating!</li>
      </ul>

      <h3>Hover Time</h3>
      <ul>
        <li><strong>What it shows:</strong> How long you could hover (not very realistic)</li>
        <li><strong>Useful for:</strong> Comparing efficiency between builds</li>
      </ul>

      <h2>The Graphs Explained</h2>

      <h3>1. Thrust vs Throttle</h3>
      <ul>
        <li><strong>X-axis:</strong> Your throttle stick position (0-100%)</li>
        <li><strong>Y-axis:</strong> How much thrust you get (in grams)</li>
        <li><strong>What to look for:</strong> Should be a smooth curve going up</li>
      </ul>

      <h3>2. Power Draw vs Throttle</h3>
      <ul>
        <li><strong>X-axis:</strong> Throttle position</li>
        <li><strong>Y-axis:</strong> How much power being used (Watts)</li>
        <li><strong>What to look for:</strong> Goes up fast at high throttle (exponential)</li>
      </ul>

      <h3>3. Flight Time vs Battery Capacity</h3>
      <ul>
        <li><strong>Shows:</strong> How different battery sizes affect flight time</li>
        <li><strong>Use it to:</strong> Decide if upgrading to a bigger battery is worth the weight</li>
      </ul>

      <h3>4. Battery Discharge Curve</h3>
      <ul>
        <li><strong>Shows:</strong> How voltage drops as battery drains</li>
        <li><strong>Why it matters:</strong> Lower voltage = less power = worse performance at end of flight</li>
      </ul>

      <h3>5. Current Draw vs Throttle</h3>
      <ul>
        <li><strong>Shows:</strong> How many amps at different throttle positions</li>
        <li><strong>Critical check:</strong> Make sure peak current doesn't exceed your battery's max output!</li>
      </ul>

      <h3>6. Weight Distribution Pie Chart</h3>
      <ul>
        <li><strong>Shows:</strong> Where your weight is going</li>
        <li><strong>Use it to:</strong> Find heavy components you could swap for lighter ones</li>
      </ul>

      <h1>Step-by-Step: Your First Build Check</h1>

      <h2>Step 1: Gather Your Parts Info</h2>
      <p>Write down or screenshot the specs for:</p>
      <ul>
        <li>Motors (model, KV, weight, max amps)</li>
        <li>Props (size, pitch)</li>
        <li>Battery (S count, mAh, weight, C rating)</li>
        <li>ESCs (weight, amp rating)</li>
        <li>Frame (weight)</li>
        <li>All electronics (weights and current draw if known)</li>
      </ul>

      <h2>Step 2: Enter Basic Info</h2>
      <p>Start with:</p>
      <ol>
        <li>Motor count (probably 4)</li>
        <li>Motor weight</li>
        <li>Motor KV</li>
        <li>Motor max current (if you don't know, start with 30A)</li>
        <li>Battery cells (S count)</li>
        <li>Battery capacity</li>
        <li>Battery weight</li>
      </ol>

      <h2>Step 3: Fill in Propellers</h2>
      <ol>
        <li>Prop size (probably 5 inches)</li>
        <li>Prop pitch (probably 4.3)</li>
      </ol>

      <h2>Step 4: Enter Other Components</h2>
      <p>Fill in the weights for everything else. If you don't know:</p>
      <ul>
        <li>Frame: 120g</li>
        <li>FC: 8g</li>
        <li>Camera: 15g</li>
        <li>VTX: 8g</li>
        <li>RX: 3g</li>
        <li>Other: 30g</li>
      </ul>

      <h2>Step 5: Check Your Results</h2>
      <p><strong>Look at Thrust-to-Weight first:</strong></p>
      <ul>
        <li>Below 2:1? Something is wrong - too heavy or not enough power</li>
        <li>2-2.5:1? Will fly but might not be fun</li>
        <li>2.5-4:1? Good build!</li>
        <li>Above 4:1? Racing machine!</li>
      </ul>

      <p><strong>Check Flight Time:</strong></p>
      <ul>
        <li>Less than 2 minutes? Might want a bigger battery</li>
        <li>3-5 minutes? Perfect for freestyle</li>
        <li>Over 10 minutes? Long-range build</li>
      </ul>

      <p><strong>Check Current Draw:</strong></p>
      <p>Calculate: Total current / (Battery mAh / 1000) = Load in C</p>
      <ul>
        <li>Less than battery C rating? Good!</li>
        <li>More than battery C rating? Battery will overheat or die fast</li>
      </ul>

      <h2>Step 6: Adjust and Experiment</h2>
      <p>Try changing:</p>
      <ul>
        <li>Battery capacity (see how it affects flight time vs weight)</li>
        <li>Motor KV (higher = more power but shorter flight)</li>
        <li>Prop size (bigger = more thrust but more current)</li>
      </ul>

      <h1>Common Mistakes to Avoid</h1>

      <h2>Mistake 1: "My thrust-to-weight is 1.5:1, that's fine right?"</h2>
      <p><strong>NO!</strong> You need at least 2:1 to fly safely. Anything less is dangerous.</p>

      <h2>Mistake 2: Forgetting the GoPro</h2>
      <p>If you plan to add a GoPro (100g), add it to "Other Weight"!</p>

      <h2>Mistake 3: Using Manufacturer's Thrust Claims Without Testing</h2>
      <p>Many manufacturers exaggerate thrust numbers. Always use actual test data if possible.</p>

      <h2>Mistake 4: Ignoring the Battery C Rating</h2>
      <p>
        Example: 1300mAh 50C battery can only provide 65A safely. 
        If your drone draws 80A at full throttle, the battery will puff/die!
      </p>

      <h2>Mistake 5: Huge Battery = Better?</h2>
      <p>
        Not always! A heavy battery might give you LESS flight time because the extra weight requires more power to fly.
      </p>

      <h2>Mistake 6: Entering Total Weight Instead of "Each"</h2>
      <p>When it says "Motor Weight (g each)" - that's ONE motor, not all four!</p>

      <h1>Real Examples</h1>

      <h2>Example 1: 5" Freestyle Quad (Good Build)</h2>
      <ul>
        <li><strong>Motors:</strong> 2207 2450KV, 30g each, 35A max</li>
        <li><strong>Props:</strong> 5x4.3x3</li>
        <li><strong>Battery:</strong> 4S 1500mAh, 180g</li>
        <li><strong>Total Weight:</strong> 620g</li>
        <li><strong>Max Thrust:</strong> 2400g</li>
        <li><strong>Thrust-to-Weight:</strong> 3.87:1</li>
        <li><strong>Flight Time:</strong> ~4 minutes</li>
        <li><strong>Verdict:</strong> Excellent freestyle build!</li>
      </ul>

      <h2>Example 2: Racing Quad</h2>
      <ul>
        <li><strong>Motors:</strong> 2306 2650KV, 32g each, 40A max</li>
        <li><strong>Props:</strong> 5x4x3</li>
        <li><strong>Battery:</strong> 4S 1300mAh, 150g (lighter for speed)</li>
        <li><strong>Total Weight:</strong> 520g</li>
        <li><strong>Max Thrust:</strong> 2800g</li>
        <li><strong>Thrust-to-Weight:</strong> 5.4:1</li>
        <li><strong>Flight Time:</strong> ~2.5 minutes</li>
        <li><strong>Verdict:</strong> Fast racing machine, short but intense flights</li>
      </ul>

      <h2>Example 3: Bad Build (Don't Do This!)</h2>
      <ul>
        <li><strong>Motors:</strong> 2204 2300KV, 25g each (too weak)</li>
        <li><strong>Props:</strong> 5x4.3x3</li>
        <li><strong>Battery:</strong> 4S 2200mAh, 260g (too heavy)</li>
        <li><strong>Total Weight:</strong> 780g</li>
        <li><strong>Max Thrust:</strong> 1400g</li>
        <li><strong>Thrust-to-Weight:</strong> 1.79:1</li>
        <li><strong>Verdict:</strong> Won't fly well! Either use bigger motors or lighter battery</li>
      </ul>

      <h1>Troubleshooting</h1>

      <h2>"My flight time shows 1 minute, that's wrong!"</h2>
      <p><strong>Possible causes:</strong></p>
      <ul>
        <li>Average throttle too high (try 40-50%)</li>
        <li>Motor max current too high (check actual specs)</li>
        <li>Battery capacity too small</li>
      </ul>

      <h2>"My thrust-to-weight is 10:1, is that right?"</h2>
      <p><strong>Probably wrong!</strong> Check:</p>
      <ul>
        <li>Did you enter motor thrust at 100% correctly?</li>
        <li>Is your motor KV entered correctly?</li>
        <li>Are all weights entered?</li>
        <li>Uncheck "Use Measured Thrust Data" if you don't have real data</li>
      </ul>

      <h2>"The calculator says I need 150A but my battery is only 75C (112A max)"</h2>
      <p><strong>This means:</strong></p>
      <ul>
        <li>At full throttle, you'll exceed battery limit</li>
        <li>You'll get voltage sag and reduced performance</li>
        <li>Options: Get higher C battery OR reduce motor max current (fly less aggressive)</li>
      </ul>

      <h2>"What if I don't know the motor efficiency or internal resistance?"</h2>
      <p><strong>Leave them at defaults:</strong></p>
      <ul>
        <li>Motor efficiency: 75%</li>
        <li>ESC efficiency: 96%</li>
        <li>Battery resistance: 10 mΩ per cell</li>
      </ul>
      <p>These are reasonable estimates.</p>

      <h1>Quick Reference Card</h1>

      <h2>Good Thrust-to-Weight Values:</h2>
      <ul>
        <li>Cinematic: 2.5-3.5:1</li>
        <li>Freestyle: 3.5-5:1</li>
        <li>Racing: 5:1+</li>
      </ul>

      <h2>Typical Flight Times:</h2>
      <ul>
        <li>Racing: 2-4 min</li>
        <li>Freestyle: 3-5 min</li>
        <li>Long-range: 10-20 min</li>
      </ul>

      <h2>Common Motor KV by Use:</h2>
      <ul>
        <li>Cinematic: 1200-1800 KV</li>
        <li>Freestyle: 1800-2400 KV</li>
        <li>Racing: 2300-2700 KV</li>
      </ul>

      <h2>Battery Cell Count:</h2>
      <ul>
        <li>3S = 11.1V (beginner)</li>
        <li>4S = 14.8V (standard)</li>
        <li>6S = 22.2V (high power)</li>
      </ul>
    </div>
  );
}

export default Manual;