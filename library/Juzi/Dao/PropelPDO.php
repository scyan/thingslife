<?php
/**
 * PDO connection subclass that provides the basic fixes to PDO that are required by Propel.
 *
 * This class was designed to work around the limitation in PDO where attempting to begin
 * a transaction when one has already been begun will trigger a PDOException.  Propel
 * relies on the ability to create nested transactions, even if the underlying layer
 * simply ignores these (because it doesn't support nested transactions).
 *
 * The changes that this class makes to the underlying API include the addition of the
 * getNestedTransactionDepth() and isInTransaction() and the fact that beginTransaction()
 * will no longer throw a PDOException (or trigger an error) if a transaction is already
 * in-progress.
 *
 * @author     Cameron Brunner <cameron.brunner@gmail.com>
 * @author     Hans Lellelid <hans@xmpl.org>
 * @author     Christian Abegg <abegg.ch@gmail.com>
 * @since      2006-09-22
 * @package    propel.runtime.connexion
 */
class PropelPDO extends PDO
{

	/**
	 * The current transaction depth.
	 * @var        int
	 */
	protected $nestedTransactionCount = 0;

	/**
	 * Whether the final commit is possible
	 * Is false if a nested transaction is rolled back
	 */
	protected $isUncommitable = false;
	

	/**
	 * Gets the current transaction depth.
	 * @return     int
	 */
	public function getNestedTransactionCount()
	{
		return $this->nestedTransactionCount;
	}

	/**
	 * Set the current transaction depth.
	 * @param      int $v The new depth.
	 */
	protected function setNestedTransactionCount($v)
	{
		$this->nestedTransactionCount = $v;
	}

	/**
	 * Decrements the current transaction depth by one.
	 */
	protected function decrementNestedTransactionCount()
	{
		$this->nestedTransactionCount--;
	}

	/**
	 * Increments the current transaction depth by one.
	 */
	protected function incrementNestedTransactionCount()
	{
		$this->nestedTransactionCount++;
	}

	/**
	 * Is this PDO connection currently in-transaction?
	 * This is equivalent to asking whether the current nested transaction count
	 * is greater than 0.
	 * @return     boolean
	 */
	public function isInTransaction()
	{
		return ($this->getNestedTransactionCount() > 0);
	}
	
	/**
	 * Overrides PDO::beginTransaction() to prevent errors due to already-in-progress transaction.
	 */
	public function beginTransaction()
	{
		$return = true;
		$opcount = $this->getNestedTransactionCount();
		if ( $opcount === 0 ) {
			$return = parent::beginTransaction();
			$this->isUncommitable = false;
		}
		$this->incrementNestedTransactionCount();
		return $return;
	}

	/**
	 * Overrides PDO::commit() to only commit the transaction if we are in the outermost
	 * transaction nesting level.
	 */
	public function commit()
	{
		$return = true;
		$opcount = $this->getNestedTransactionCount();
		if ($opcount > 0) {
			if ($opcount === 1) {
				if ($this->isUncommitable) {
					throw new Exception('Cannot commit because a nested transaction was rolled back');
				} else {
					$return = parent::commit();
				}
			}
			$this->decrementNestedTransactionCount();
		}
		return $return;
	}

	/**
	 * Overrides PDO::rollBack() to only rollback the transaction if we are in the outermost
	 * transaction nesting level
	 * @return     boolean Whether operation was successful.
	 */
	public function rollBack()
	{
		$return = true;
		$opcount = $this->getNestedTransactionCount();
		if ($opcount > 0) {
			if ($opcount === 1) {
				$return = parent::rollBack();
			} else {
				$this->isUncommitable = true;
			}
			$this->decrementNestedTransactionCount(); 
		}
		return $return;
	}

	/**
	* Rollback the whole transaction, even if this is a nested rollback
	* and reset the nested transaction count to 0.
	* @return     boolean Whether operation was successful.
	*/
	public function forceRollBack()
	{
		$return = true;
		$opcount = $this->getNestedTransactionCount();
		if ($opcount > 0) {
			// If we're in a transaction, always roll it back
			// regardless of nesting level.
			$return = parent::rollBack();

			// reset nested transaction count to 0 so that we don't
			// try to commit (or rollback) the transaction outside this scope.
			$this->nestedTransactionCount = 0;

		}
		return $return;
	}
}