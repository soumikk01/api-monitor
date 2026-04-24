import React from 'react';
import styles from './ArchitectureDiagram.module.scss';

export function ArchitectureDiagram({ dark, isVisible = true }: { dark?: boolean, isVisible?: boolean }) {
  return (
    <div className={`${styles.diagramWindow}${dark ? ' ' + styles.dark : ''}${isVisible ? ' ' + styles.animateInner : ''}`}>
      {/* Column 1 */}
      <div className={styles.column}>
        <div className={styles.title}>Row-level</div>
        <div className={styles.illustration}>
          <div className={styles.ringWrapper}>
            <div className={styles.ring}>
              <div className={styles.ring}>
                <div className={styles.ring}>
                  <div className={styles.ring}>
                    <div className={styles.barContainer}>
                      <div className={styles.barBlue} />
                      <div className={styles.barGreen} />
                      <div className={styles.barBlue} />
                      <div className={styles.barGreen} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Column 2 */}
      <div className={styles.column}>
        <div className={styles.title}>Schema-per-<br />tenant</div>
        <div className={styles.illustration}>
          <div className={styles.ringWrapper}>
            <div className={styles.ring}>
              <div className={styles.ring}>
                <div className={styles.stackContainer}>
                  <div className={styles.ringSmall}>
                    <div className={styles.ringSmall}>
                      <div className={styles.barContainer}>
                        <div className={styles.barBlue} />
                        <div className={styles.barBlue} />
                      </div>
                    </div>
                  </div>
                  <div className={styles.ringSmall}>
                    <div className={styles.ringSmall}>
                      <div className={styles.barContainer}>
                        <div className={styles.barGreen} />
                        <div className={styles.barGreen} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Column 3 */}
      <div className={styles.column}>
        <div className={styles.title}>Database-per-<br />tenant</div>
        <div className={styles.illustration}>
          <div className={styles.sideBySideContainer}>
            <div className={styles.ringWrapperSide}>
              <div className={styles.ring}>
                <div className={styles.ring}>
                  <div className={styles.ring}>
                    <div className={styles.ringHollow} />
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.ringWrapperSide}>
              <div className={styles.ring}>
                <div className={styles.ring}>
                  <div className={styles.ring}>
                    <div className={styles.ringHollow} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
